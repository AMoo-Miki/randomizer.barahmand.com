const form = document.forms[0];
const result = document.querySelector('.result');
const elHeader = result.querySelector('.header');
const elContent = result.querySelector('.content');
const elements = form.elements;
const elCount = elements.setCount;
const elSize = elements.setSize;
const elMin = elements.setMin;
const elMax = elements.setMax;
const elUnique = elements.unique;

const SetLeastMax = () => {
    if ([].some.call(elements, el => el.type === 'number' && (!el.value || el.validity.badInput))) return;
    elMax.min = elUnique.checked ? ((elCount.value * elSize.value) + 1 * elMin.value - 1) : elMin.value;
};

const Generate = () => {
    const minValue = 1 * elMin.value;
    const countValue = 1 * elCount.value;
    const sizeValue = 1 * elSize.value;
    const rangeSize = elMax.value - minValue + 1;
    let sets = [];
    if (elUnique.checked) {
        let temp = Array.from({length: rangeSize}, (v, k) => k + minValue),
            posCurrent = rangeSize,
            posEnd = rangeSize - countValue * sizeValue,
            posTemp;

        while(posCurrent) {
            posTemp = Math.floor(Math.random() * posCurrent--);
            [temp[posCurrent], temp[posTemp]] = [temp[posTemp], temp[posCurrent]];
            if (posCurrent <= posEnd) break;
        }

        for (posCurrent = 0; posCurrent < countValue; posCurrent++) sets.push(temp.slice(posEnd + posCurrent * sizeValue, sizeValue + posEnd + posCurrent * sizeValue));
    } else {
        sets = Array.from({length: countValue}, a => Array.from({length: sizeValue}, b => Math.floor(Math.random() * rangeSize + minValue)));
    }

    if (elements.sorted.checked) sets.forEach(el => el.sort((a, b) => a - b));

    sets.forEach(el => console.log(el.join(',')));

    Display(sets);
};

const Column = num => {
    let ret = '', a = 1, b = 26;
    for (; (num -= a) >= 0; a = b, b *= 26) {
        ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
    }
    return ret;
};

const Display = sets => {
    const dataWidth = 30 + 7 * Math.max(('' + elMin.value).length, ('' + elMax.value).length);
    const indexWidth = 30 + 7 * ('' + elSize.value).length;

    elContent.innerHTML =
        `<div style="width: ${indexWidth}px">${Array.from({length: 1 * elSize.value}, (v, k) => k + 1).join('<br />\r\n')}</div>` +
        sets.map(set => `<div style="width: ${dataWidth}px">${set.join('<br />\r\n')}</div>`).join('');
    elHeader.innerHTML = `<div style="width: ${indexWidth}px" title="Copy all numbers"></div>` + Array.from({length: 1 * elCount.value}, (v, k) => `<div style="width: ${dataWidth}px" title="Copy this column">${Column(k + 1)}</div>`).join('');
    result.style.display = 'block';
};

form.addEventListener('submit', e => {
    e.preventDefault();
    const numbers = [].filter.call(elements, el => el.type === 'number' && !el.required);
    if (numbers.length) {
        numbers.forEach(el => el.required = true);
        SetLeastMax();
        if (!form.checkValidity()) return;
    }
    Generate();
}, false);

form.addEventListener('input', e => {
    const target = e.target;
    if (target.type !== 'number') return;
    if (!target.required) target.required = true;
    SetLeastMax();
}, false);

form.addEventListener('change', e => {
    const target = e.target;
    if (target.type !== 'checkbox') return;
    if (target.name === 'unique') SetLeastMax();
}, false);

elHeader.addEventListener('click', e => {
    e.preventDefault();
    const target = e.target;
    if (target === elHeader) return;
    const idx = [].indexOf.call(elHeader.childNodes, target);
    if (idx < 1) return;

    const range = document.createRange();
    const selection = window.getSelection();
    selection.removeAllRanges();
    range.selectNode(elContent.childNodes.item(idx));
    selection.addRange(range);
    document.execCommand("copy");
}, false);