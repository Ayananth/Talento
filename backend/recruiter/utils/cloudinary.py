import time
import cloudinary.utils


def generate_signed_raw_url(public_id, expires_in=300, force_download=False):
    if not public_id:
        return None

    options = {
        "resource_type": "raw",
        "sign_url": True,
        "expires_at": int(time.time()) + expires_in,
        "secure": True, 
    }

    if force_download:
        options["flags"] = "attachment"

    url, _ = cloudinary.utils.cloudinary_url(
        public_id,
        **options
    )

    return url
