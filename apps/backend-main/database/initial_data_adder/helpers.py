import os
import sys
import uuid
from pathlib import Path
from shutil import copy2

from faker import Faker
from faker.providers import date_time, person
from flask import current_app

from devgag_api.models import User

fake = Faker()
fake.add_provider(person)
fake.add_provider(date_time)


# Getting absolute path to initial "src" meme_images.
def get_meme_image_src_folder_path():
    current_script_dir_path = os.path.dirname(__file__)
    return os.path.join(current_script_dir_path, "meme_images")


# Getting where initial "src meme images" should be copied into. (Original Upload Folder)
def get_meme_image_dest_folder_path():
    # Getting base path, To specify where uploaded files will be saved.
    upload_storage_base_path = current_app.config["UPLOAD_STORAGE_BASE_PATH"]
    upload_storage_folder_name = current_app.config[
        "UPLOAD_STORAGE_FOLDER_NAME"
    ]
    meme_photo_storage_folder = "meme_posts"

    current_script_dir_path = os.path.dirname(__file__)
    upload_storage_absolute_path = os.path.abspath(
        os.path.join(current_script_dir_path, "../..", upload_storage_base_path)
    )

    meme_photo_storage_path = (
        upload_storage_absolute_path
        + "/"
        + upload_storage_folder_name
        + "/"
        + meme_photo_storage_folder
    )

    # Creating a directory if not exist.
    Path(meme_photo_storage_path).mkdir(parents=True, exist_ok=True)

    return meme_photo_storage_path


# Copying initial "src meme images" into Upload Folder.
def copy_meme_image(src_file_name=None):
    if src_file_name is None:
        return  # noqa : WPS400

    src_meme_image_folder_path = get_meme_image_src_folder_path()
    dest_meme_image_folder_path = get_meme_image_dest_folder_path()

    src_meme_image_path = os.path.join(
        src_meme_image_folder_path, src_file_name
    )

    uuid_prefix = uuid.uuid1()
    save_file_name = str(uuid_prefix) + "__" + src_file_name

    dest_meme_image_path = os.path.join(
        dest_meme_image_folder_path, save_file_name
    )

    copy2(str(src_meme_image_path), str(dest_meme_image_path))

    upload_storage_folder_name = current_app.config[
        "UPLOAD_STORAGE_FOLDER_NAME"
    ]
    meme_photo_storage_folder = "meme_posts"
    return f"{upload_storage_folder_name}/{meme_photo_storage_folder}/{save_file_name}"


# Creating lot of initial users which will be used to create initial posts and likes on them.
def create_user_set():
    try:
        created_user_ids = []

        for i in range(1, 100):
            # Making faker randomness is predictable.
            fake.seed_instance(i * 1000)

            username = fake.email()

            user_details = {
                "username": username,
                "email": username,
                "password": "PASSWORD",
                "first_name": fake.first_name(),
                "last_name": fake.last_name(),
            }

            created_user = User.create(**user_details, active=1)
            created_user_ids.append(created_user.id)

        return created_user_ids
    except Exception as e:
        print(
            "\n--------------------------------------------\nInitial Data Already Exist. Aborting...\n--------------------------------------------\n",
            e,
        )
        sys.exit()
