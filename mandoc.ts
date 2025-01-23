import { serve, spawn, file } from "bun";
import { mkdir, exists } from "node:fs/promises";

main();

async function main() {
    if (!await exists('html')) {
        await mkdir("html");
    }

    const server = serve({ fetch });

    console.log(server.url.href);
}

async function fetch(req: Request) {
    let pathname = (new URL(req.url)).pathname;
    console.log('path: ', pathname)

    if (!pathname.startsWith('/')) {
        return new Response(null, { status: 400 });
    }

    if ((/\.png$/i).test(pathname)) {
        return new Response(await file(`html/${pathname}`).stream());
    }

    pathname = pathname.replace(/^\//, '');
    if ((/\//).test(pathname)) {
        return new Response(null, { status: 404 });
    }

    let section = '';
    let name = 'groff';
    name = pathname;
    const m = pathname.match(/^(.*?)\.(\d+)$/);
    if (m) {
        name = m[1];
        section = m[2];
    }

    // man -aw groff => "/usr/share/man/man1/man.1"
    const manPath = (await new Response(spawn(["man", "-w", ...(section ? [section] : []), name], { cwd: 'html' }).stdout).text()).trim();

    if (!manPath) {
        return new Response(null, { status: 404 });
    }

    // % groff -mandoc -Thtml /usr/share/man/man1/man.1 >man.html
    const proc = spawn(["groff", "-mandoc", "-Thtml", manPath], {
        cwd: 'html',
    });

    const res = new Response(proc.stdout);

    const rewriter = createRewriter();

    return rewriter.transform(res);
}

function createRewriter() {
    return new HTMLRewriter().on("a", {
        element(a) {
            let href = a.getAttribute('href')
            if (href) {
                const m = href.match(/^man:(.*?)(?:\((\d+)\))?$/);
                if (m) {
                    a.setAttribute('href', `/${m[1]}${m[2] ? `.${m[2]}` : ''}`)
                }
            }
        },
    });
}
