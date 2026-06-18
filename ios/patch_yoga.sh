cd ios

# Find the actual file (follow symlinks)
YOGAFILE=$(find Pods -name "FloatOptional.h" -type f 2>/dev/null | head -1)

if [ -f "$YOGAFILE" ]; then
    echo "Found file: $YOGAFILE"
    
    # Create a backup
    cp "$YOGAFILE" "$YOGAFILE.bak"
    
    # Remove 'explicit' keyword using perl (more reliable than sed)
    perl -pi -e 's/explicit constexpr FloatOptional/constexpr FloatOptional/g' "$YOGAFILE"
    
    # Verify the change
    if grep -q "explicit constexpr FloatOptional" "$YOGAFILE"; then
        echo "❌ Failed to patch"
    else
        echo "✅ Successfully patched FloatOptional.h"
    fi
else
    echo "⚠️ FloatOptional.h not found"
fi