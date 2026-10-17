#!/bin/bash
# Compresses all photos under SOURCE_DIR into OUTPUT_DIR, preserving folder structure.
# Resizes to max 2000px on the long side and converts to JPEG at ~75% quality.
# Originals are never touched or overwritten.

SOURCE_DIR="photo"
OUTPUT_DIR="photo_optimized"

mkdir -p "$OUTPUT_DIR"

find "$SOURCE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.heic" \) | while read -r file; do
  rel_path="${file#$SOURCE_DIR/}"
  out_path="$OUTPUT_DIR/${rel_path%.*}.jpg"
  out_dir=$(dirname "$out_path")
  mkdir -p "$out_dir"

  sips -Z 2000 -s format jpeg -s formatOptions 75 "$file" --out "$out_path" > /dev/null

  orig_size=$(stat -f%z "$file")
  new_size=$(stat -f%z "$out_path")
  echo "$rel_path: $(( orig_size / 1024 )) KB -> $(( new_size / 1024 )) KB"
done

echo ""
echo "Done. Compressed files are in: $OUTPUT_DIR"
echo "Total size before:"
du -sh "$SOURCE_DIR"
echo "Total size after:"
du -sh "$OUTPUT_DIR"
