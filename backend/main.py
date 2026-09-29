"""Brightix — static site server.

Serves the prototype pages and their assets. No database, no data APIs:
the prototype's content lives in the HTML. Clean routes are provided
(/about/who-we-are) alongside the plain .html paths the pages link to.
"""

from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

SITE_DIR = Path(__file__).resolve().parent.parent

# clean route -> file on disk
PAGES = {
    "/": "index.html",
    "/about": "about-1.html",
    "/about/who-we-are": "about-1.html",
    "/about/our-approach": "about-2.html",
    "/about/our-team": "about-3.html",
}

app = FastAPI(title="Brightix Site", docs_url=None, redoc_url=None)

# The clean /about/... routes sit one level deep, so the pages' relative
# "assets/..." and "about-2.html" references resolve under /about/. Serving both
# prefixes keeps one set of relative paths working from the root routes, the
# nested routes and file:// alike.
app.mount("/assets", StaticFiles(directory=SITE_DIR / "assets"), name="assets")
app.mount("/about/assets", StaticFiles(directory=SITE_DIR / "assets"), name="about-assets")


def _page(name: str) -> FileResponse:
    return FileResponse(
        SITE_DIR / name,
        media_type="text/html",
        headers={"Cache-Control": "no-cache"},
    )


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "brightix-site"}


for route, filename in PAGES.items():
    app.add_api_route(
        route,
        (lambda f=filename: (lambda: _page(f)))(),
        methods=["GET"],
        include_in_schema=False,
    )


@app.get("/{page}.html", include_in_schema=False)
@app.get("/about/{page}.html", include_in_schema=False)
def html_page(page: str):
    """Keep the plain .html links in the markup working."""
    target = SITE_DIR / f"{page}.html"
    if target.is_file() and target.parent == SITE_DIR:
        return _page(target.name)
    return RedirectResponse("/", status_code=302)


@app.exception_handler(404)
async def not_found(request: Request, exc):
    if "/assets/" in request.url.path:
        return JSONResponse({"detail": "Not found"}, status_code=404)
    return RedirectResponse("/", status_code=302)
