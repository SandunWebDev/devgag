"""JokePost Model."""


from devgag_api.database import Column, PkModel, db


class JokePost(PkModel):
    """A JokePost."""

    __tablename__ = "jokeposts"
    __table_args__ = (
        # Table level "CHECK" constraint.
        db.CheckConstraint(  # When type column is "TEXT", text_joke column must have a value.
            "(type='TEXT' AND text_joke IS NOT NULL) OR type!='TEXT'",
            name="CK__Unavilable__TypeAndTextJoke",
        ),
        db.CheckConstraint(  # When type column is "MEME", meme_joke column must have a value.
            "(type='MEME' AND meme_joke IS NOT NULL) OR type!='MEME'",
            name="CK__Unavilable__TypeAndMemeJoke",
        ),
    )

    # IMPORTANT NOTE : Below Field "db.CheckConstraint()" are not automatically added to "migrations" file. Make sure to add them manually if schema changed.

    type = Column(
        db.String(),
        # SIDENOTE: We are using "CheckConstraint" in here instead of "db.Enum("TEXT", "MEME")", Because SQLite don't support enum.
        db.CheckConstraint(
            "type='TEXT' OR type='MEME'", name="CK__InvalidType__Type"
        ),
        nullable=False,
    )
    title = Column(
        db.String(120),
        db.CheckConstraint("title != ''", name="CK__EmptyString__Title"),
        nullable=False,
    )
    description = Column(db.String(), nullable=True)

    text_joke = Column(
        db.String(),
        db.CheckConstraint("text_joke != ''", name="CK__EmptyString__TextJoke"),
        nullable=True,
    )
    text_background = Column(db.String(), nullable=True)
    meme_joke = Column(
        db.String(),
        db.CheckConstraint("meme_joke != ''", name="CK__EmptyString__MemeJoke"),
        nullable=True,
    )

    created_by = Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # -------------------------- Relationship Fields
    populated__created_by = db.relationship(
        "User",
        backref="backref__jokeposts",  # This add "backref__jokeposts" field to "User".
        lazy=True,
        uselist=False,
    )

    populated__likeslist = db.relationship(
        "JokePostLike",
        lazy=True,
    )

    def __repr__(self):
        """Represent instance as a unique string."""
        return f"<JokePost({self.type})>"
