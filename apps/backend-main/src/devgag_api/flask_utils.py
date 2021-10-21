"""Helper utilities and decorators for Flask."""

from flask import flash, jsonify


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


def api_error(
    err_code=400, err_msg="Error Occurred.", err_desc="", err_meta=""
):
    """Helper function to send API Error Response in pre-defined structure."""

    return (
        jsonify(
            {
                "status": "error",
                "success": False,
                "code": err_code,
                "message": err_msg,
                "description": err_desc,
                "meta": err_meta,
            }
        ),
        err_code,
    )
