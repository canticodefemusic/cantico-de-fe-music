/**
 * Cántico de Fe Music
 * V13.5.0 — Delete Media API
 */

function jsonResponse(
  data,
  status = 200
) {
  return new Response(
    JSON.stringify(
      data,
      null,
      2
    ),
    {
      status,

      headers: {
        "Content-Type":
          "application/json; charset=utf-8",

        "Cache-Control":
          "no-store"
      }
    }
  );
}

async function readBody(
  request
) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function onRequestPost(
  context
) {
  const {
    request,
    env
  } = context;

  if (!env.MEDIA_BUCKET) {
    return jsonResponse(
      {
        success: false,
        error:
          "R2 bucket binding is not configured."
      },
      500
    );
  }

  const body =
    await readBody(
      request
    );

  const key =
    String(
      body.key || ""
    ).trim();

  if (!key) {
    return jsonResponse(
      {
        success: false,
        error:
          "Missing object key."
      },
      400
    );
  }

  try {

    await env.MEDIA_BUCKET.delete(
      key
    );

    return jsonResponse({
      success: true,
      deleted: key
    });

  } catch (error) {

    console.error(
      "[Delete Media]",
      error
    );

    return jsonResponse(
      {
        success: false,
        error:
          "Unable to delete object."
      },
      500
    );
  }
}

export function onRequest() {
  return jsonResponse(
    {
      success: false,
      error:
        "Method not allowed."
    },
    405
  );
}
