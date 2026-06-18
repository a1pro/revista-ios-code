#!/bin/bash

echo "Fixing New Architecture flags..."

# Find all .xcconfig files and replace =1 with =0
find Pods -name "*.xcconfig" -exec sed -i '' 's/RCT_NEW_ARCH_ENABLED=1/RCT_NEW_ARCH_ENABLED=0/g' {} \;

# Fix project.pbxproj
find Pods -name "project.pbxproj" -exec sed -i '' 's/RCT_NEW_ARCH_ENABLED=1/RCT_NEW_ARCH_ENABLED=0/g' {} \;

# Fix .podspec files
find Pods -name "*.podspec" -exec sed -i '' 's/RCT_NEW_ARCH_ENABLED=1/RCT_NEW_ARCH_ENABLED=0/g' {} \;
find Pods -name "*.podspec.json" -exec sed -i '' 's/RCT_NEW_ARCH_ENABLED=1/RCT_NEW_ARCH_ENABLED=0/g' {} \;

echo "Done! New Architecture flags should now be 0."