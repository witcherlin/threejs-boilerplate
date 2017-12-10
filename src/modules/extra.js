let rnd = 0;

export function uuid(count = 14) {
    let uuid = [];
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    for (let i = 0; i < count; i++) {

        if (rnd <= 0x02) {
            rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
        }

        let r = rnd & 0xf;
        rnd = rnd >> 4;

        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
    }

    return uuid.join('');
}

export function isIframe() {
    try {
        return window.self !== window.top;
    }
    catch (e) {
        return true;
    }
}

export function copyToClipboard(value, done) {
    let range = document.createRange();

    // For IE.
    if (window.clipboardData) {
        window.clipboardData.setData('Text', value);
        done(null, true);
    } else {
        // Create a temporary element off screen.
        let tmpElem = $('<div>').css({
            position: 'absolute',
            left: '-1000px',
            top: '-1000px'
        });

        // Add the $input value to the temp element.
        tmpElem.text(value);

        $(document.body).append(tmpElem);

        // Select temp element.
        range.selectNodeContents(tmpElem.get(0));

        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        // Lets copy.
        try {
            let success = document.execCommand('copy', false, null);

            if (success) {
                done(null, true);
            } else {
                done(true, false);
            }
        }
        catch (err) {
            window.prompt('Copy to clipboard: Ctrl+C, Enter', value);
            done(err, true);
        }

        tmpElem.remove();
    }
}

export function downloadText(filename, text) {
    let element = document.createElement('a');

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
