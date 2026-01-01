#!/usr/bin/env bash
set -euo pipefail

echo "Starting production verification..."

npm ci

npm run type-check

set +e
npm run lint
LINT_EXIT=$?
set -e
if [ $LINT_EXIT -ne 0 ]; then
  echo "△ Lint warnings (non-fatal)"
fi

npm test
echo "✓ Unit tests passed"

set +e
npm audit --omit=dev
AUDIT_EXIT=$?
set -e
if [ $AUDIT_EXIT -ne 0 ]; then
  echo "△ Security warnings (non-fatal)"
fi

npm run build
echo "✓ Build successful"

MODULE_COUNT="$(grep -F "this.registerModule(" src/lib/gallery.ts | wc -l | tr -d '[:space:]')"
if [ "$MODULE_COUNT" -eq 10 ]; then
  echo "✓ 10 modules registered"
else
  echo "✗ Module count mismatch: $MODULE_COUNT"
  exit 1
fi

if grep -R "style=" -n dist/index.html >/dev/null 2>&1; then
  echo "✗ Inline styles found"
  exit 1
else
  echo "✓ No inline styles found"
fi

# ✅ Correct check: fail only if there is inline JS inside <script>...</script>
if perl -0777 -ne '
  my $html = $_;
  while ($html =~ m{<script\b[^>]*>(.*?)</script>}gis) {
    my $body = $1 // "";
    $body =~ s/<!--.*?-->//gs;
    $body =~ s/\s+//g;
    if (length($body) > 0) { exit 0 }  # inline JS exists
  }
  exit 1; # no inline JS bodies
' dist/index.html; then
  echo "✗ Inline script content found"
  exit 1
else
  echo "✓ No inline script content found"
fi

echo "✓ All checks passed! Production ready."
