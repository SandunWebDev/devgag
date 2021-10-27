"""Helper utilities and decorators for Flask."""

import traceback

from flask import current_app, flash, jsonify
from flask_sqlalchemy import sqlalchemy
from werkzeug.exceptions import HTTPException


def flash_errors(form, category="warning"):
    """Flash all errors for a form."""

    for field, errors in form.errors.items():
        for error in errors:
            flash(f"{getattr(form, field).label.text} - {error}", category)


def api_res(
    res_data="",
    res_meta="",
    res_code=200,
    res_status="success",
    res_desc="",
):
    """Helper function to send API Response in pre-defined structure."""

    return (
        jsonify(
            {
                "status": res_status,  # Can be "success" or "fail"". For errors use "api_error()" function instead.
                "success": res_status == "success",
                "code": res_code,
                "data": res_data,
                "meta": res_meta,
                "description": res_desc,
            }
        ),
        res_code,
    )


def api_error(  # noqa: C901, WPS231
    err_code="",
    err_msg="",
    err_desc="",
    err_meta="",
    err_obj=None,
):
    """Helper function to send API Error Response in pre-defined structure."""

    is_development = current_app.config["ENV"] == "development"

    # Base data sended to user. But some of these may changed or add more depending on some of below conditions.
    error_response = {
        "status": "error",
        "success": False,
        "code": err_code,
        "message": err_msg,
        "description": err_desc,
        "meta": err_meta,
    }

    # Extracting more data if passed a "err_obj".
    extracted_err_obj_data = {}
    if err_obj:
        err_type = type(err_obj)
        err_repr1 = ""
        err_repr4 = ""

        # When specific "code" is not provided and trying to extract "code" from err object itself..
        #  Event if that not possible setting code to 500, Indicating Server Error. (Mostly Syntax Error in Code itself.)
        if not err_code:
            try:
                error_response["code"] = int(err_obj.code)
            except:  # noqa: E722
                error_response["code"] = 500

        # Trying to extract "message" and "args" value from err object, If possible.
        try:
            err_repr1 = err_obj.message
            err_repr4 = err_obj.args[0]
        except:  # noqa: E722, S110
            pass  # noqa: WPS420

        # Multiple details extracted from err object.
        # These are mostly for development debug purposes.
        extracted_err_obj_data = {
            **extracted_err_obj_data,
            "err_repr1": err_repr1,
            "err_repr2": repr(err_obj),
            "err_repr3": str(err_obj),
            "err_repr4": err_repr4,
            "err_type": str(err_type),
            "err_code": error_response["code"],
            "traceback": str(traceback.format_exc()),
        }

        # -------------- Handling Special Kind of Error Set --------------

        # Handling SQLAlchemyErrors.
        if issubclass(err_type, sqlalchemy.exc.SQLAlchemyError):
            # Prettry message defining why error occurred on db.
            db_err_msg = str(err_obj.__dict__["orig"])  # noqa: WPS609

            if not err_msg:
                error_response["message"] = db_err_msg
            elif not err_desc:
                error_response["description"] = db_err_msg

        # Handling HTTP related errors. (See https://werkzeug.palletsprojects.com/en/2.0.x/exceptions/)
        if issubclass(err_type, HTTPException):
            if not err_msg:
                error_response["message"] = err_obj.name
            if not err_desc:
                error_response["description"] = err_obj.description

    # When error message is not set anywhere, Setting generic messsage.
    if not error_response["message"]:
        error_response["message"] = "Error Occurred"

    # When error code is not set anywhere, Setting code to 500, Indicating Server Error.
    if not error_response["code"]:
        error_response["code"] = 500

    # Sending more data, if its "development" environment.
    if is_development:
        error_response["__dev"] = extracted_err_obj_data

    return (
        jsonify(error_response),
        error_response["code"],
    )
