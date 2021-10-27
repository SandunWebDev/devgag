"""JokePostLike Model."""

from devgag_api.database import Column, PkModel, db


class JokePostLike(PkModel):
    """A JokePostLike."""

    __tablename__ = "jokepost_likes"
    __table_args__ = (
        db.UniqueConstraint(  # A user can like/dislike, specific post only once. (Simply no multiple like for a post by same user)
            "user_id",
            "jokepost_id",
            name="UK__ALREADYEXIST__UserIdAndJokePostId",
        ),
    )

    # IMPORTANT NOTE : Below Field "db.CheckConstraint()" are not automatically added to "migrations" file. Make sure to add them manually if schema changed.

    user_id = Column(
        db.Integer(),
        db.ForeignKey("users.id"),
        nullable=False,
    )
    jokepost_id = Column(
        db.Integer(),
        db.ForeignKey("jokeposts.id"),
        nullable=False,
    )
    like = Column(
        db.Integer(),  # SIDENOTE: We are using "CheckConstraint" in here instead of "db.Enum(-1, 1)", Because SQLite don't support enum.
        db.CheckConstraint("like=1 OR like=-1", name="CK__InvalidType__Like"),
        nullable=False,
    )

    def __repr__(self):
        """Represent instance as a unique string."""
        return f"<JokePostLike ({self.like})>"
