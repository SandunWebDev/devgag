# A helper Utility to add initial seed data to the database. So frontend UI not be empty.
# So if want to fill db with some initial data, Simply run this script after necessary ".env" values are filed in.

import random
from datetime import datetime as dt

from faker import Faker
from faker.providers import date_time, person
from helpers import copy_meme_image, create_user_set
from joke_post_data import meme_jokes, text_jokes, direct_link_base_path

from devgag_api.app import create_app
from devgag_api.models import JokePost, JokePostLike

fake = Faker()
fake.add_provider(person)
fake.add_provider(date_time)

app = create_app()
with app.app_context():

    # Full initial joke List.
    jokes = text_jokes + meme_jokes

    # Creating multiple users, Which will be used to create posts and add likes in here.
    user_id_list = create_user_set(100)

    # Created post's id will be updated in here.
    created_post_id_list = []

    # Creating all initial joke posts.
    for index, post in enumerate(jokes):
        post_type = post["type"]

        mutated_post = post.copy()

        # Random CreatedBy User.
        random.seed(index * 1000)
        mutated_post["created_by"] = random.choice(user_id_list)

        # Random CreatedAt/UpdatedAt Time. So posts will spread out some time frame.
        fake.seed_instance(index * 1000)
        posted_date = fake.date_time_between(start_date=dt(2021, 10, 15))
        mutated_post["created_at"] = posted_date
        mutated_post["updated_at"] = posted_date

        # Copying MemeJoke's images into relevant upload folder.
        if post_type == "MEME":
            # IMPORTANT NOTE : Until we deploy on a persistent server, We use workaround, which just directly use github uploaded link.
            mutated_post["meme_joke"] = (
                direct_link_base_path + post["meme_joke"]
            )

            # When on presisting server enable below codes instead of above.
            # db_meme_joke_image_path = copy_meme_image(post["meme_joke"])
            # mutated_post["meme_joke"] = db_meme_joke_image_path

        created_post = JokePost.create(**mutated_post)
        created_post_id_list.append(created_post.id)

    # Randomly liking/disliking created Posts by each created user.
    for index2, user_id in enumerate(user_id_list):
        # Getting random post set to be liked by current loop user.
        random.seed(index2 * 1000)
        post_list_to_be_like = random.sample(
            created_post_id_list, len(created_post_id_list)
        )

        # Shuffeling above selected post list, So frontend Hot & General section is somewhat different.
        shuffled_post_list_to_be_like = post_list_to_be_like.copy()
        random.shuffle(shuffled_post_list_to_be_like)

        # Looping through each post to be liked by current loop user.
        for index3, post_id_to_be_like in enumerate(  # noqa: WPS
            shuffled_post_list_to_be_like
        ):
            # Randomly choosing whether to like or dislike the post.
            random.seed(index3 * 1000)
            like_or_dislike = random.choice(
                [-1, 1, 1, 1]
            )  # Three "1" is to increase the like count probability.

            JokePostLike.create(
                jokepost_id=post_id_to_be_like,
                user_id=user_id,
                like=like_or_dislike,
            )

    print(
        "\n------------------------------------------------\nDatabase successfully seeded with Initial Data\n------------------------------------------------\n"
    )
