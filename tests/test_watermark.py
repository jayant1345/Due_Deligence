import os
import tempfile
import pytest
from PIL import Image
from app.services.image_watermark import generate_thumbnail, stamp_hard_watermark


def test_hard_pixel_watermark_stamping():
    with tempfile.TemporaryDirectory() as tmpdir:
        input_img_path = os.path.join(tmpdir, "test_input.jpg")
        output_img_path = os.path.join(tmpdir, "test_watermarked.jpg")

        # Create 800x600 test image
        img = Image.new("RGB", (800, 600), color=(200, 220, 240))
        img.save(input_img_path, format="JPEG")

        stamp_hard_watermark(
            input_image_path=input_img_path,
            output_image_path=output_img_path,
            case_no="SBI-HL-2024-8841",
            agent_name="Rajesh Varma",
            agent_id="FA-9042",
            lat=19.0592,
            lon=72.8298,
            accuracy=3.2,
            geofence_status="COMPLIANT",
        )

        assert os.path.exists(output_img_path)
        with Image.open(output_img_path) as out_img:
            # Width should be identical, height should include bottom banner
            assert out_img.size[0] == 800
            assert out_img.size[1] > 600


def test_thumbnail_generation():
    with tempfile.TemporaryDirectory() as tmpdir:
        input_img_path = os.path.join(tmpdir, "test_input.jpg")
        thumb_path = os.path.join(tmpdir, "test_thumb.jpg")

        img = Image.new("RGB", (1200, 900), color=(100, 150, 200))
        img.save(input_img_path, format="JPEG")

        generate_thumbnail(input_img_path, thumb_path, size=(400, 300))

        assert os.path.exists(thumb_path)
        with Image.open(thumb_path) as thumb_img:
            assert thumb_img.size[0] <= 400
            assert thumb_img.size[1] <= 300
