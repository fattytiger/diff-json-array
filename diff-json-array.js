const jsonArr1 = [
    { 
        field1: 'a',
        field2: true,
        field3: 1,
        field4: { other: 'good' },
        filed5: [ 1, 2, 3 ],
        filed6: undefined,
        field7: null
    },
    {
        field1: 'b',
        field2: false,
        field3: 2,
        field4: { other: 'better' },
        filed5: [ 4, 5, 6 ],
    },
    {
        field1: 'c',
        field2: true,
        field3: 3,
        field4: { other: 'best' },
        filed5: [ 7, 8, 9 ]
    }
];
const jsonArr2 = [
    { 
        field1: 'a',
        field2: true,
        field3: 1,
        field4: { other: 'good' },
        filed5: [ 1, 2, 3 ],
        filed6: undefined,
        field7: null
    },
    {
        field1: 'b',
        field2: false,
        field3: 2,
        field4: { other: 'better' },
        filed5: [ 4, 5, 6 ],
    }
];
const jsonArr3 = [
    { 
        field1: 'a',
        field2: true,
        field3: 1,
        field4: { other: 'good' },
        filed5: [ 1, 2, 3 ],
        filed6: undefined,
        field7: null
    },
    {
        field1: 'b',
        field2: false,
        field3: 2,
        field4: { other: 'better' },
        filed5: [ 4, 5, 6 ],
    },
    {
        field1: 'c',
        field2: true,
        field3: 3,
        field4: { other: 'best' },
        filed5: [ 7, 8, 9 ]
    },
    {
        field1: 'd',
        field2: false,
        field3: 5,
        field4: { other: 'giant' },
        filed5: [ 10, 11, 12 ]
    }
];

const jsonArr4 = [
    { 
        field1: 'a',
        field2: true,
        field3: 1,
        field4: { other: 'good' },
        filed5: [ 1, 2, 3 ],
        filed6: undefined,
        field7: null
    },
    {
        field1: 'b',
        field2: false,
        field3: 2,
        field4: { other: 'better' },
        filed5: [ 4, 5, 6 ],
    },
    {
        field1: 'c',
        field2: true,
        field3: 3,
        field4: { other: 'best' },
        filed5: [  8, 9, 6 ]
    }
];

function isArray (value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}

function isObject (value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}

function isString (value) {
    return Object.prototype.toString.call(value) === '[object String]';
}

function isNumber (value) {
    return Object.prototype.toString.call(value) === '[object Number]';
}

function isBoolean (value) {
    return Object.prototype.toString.call(value) === '[object Boolean]';
}

function isUndefined (value) {
    return Object.prototype.toString.call(value) === '[object Undefined]';
}

function isNull (value) {
    return Object.prototype.toString.call(value) === '[object Null]';
}




function getObjectDeep (obj) {
    if (!isObject(obj)) return -1;
    const deepArr = [];
    for (const key in obj) {
        let deep = 1;
        if (isObject(obj[key])) {
            deep += getObjectDeep(obj[key])
        }
        deepArr.push(deep);
    }
    return deepArr.sort((a, b) => b - a)[0];
}

function absoluteEqual (obj1, obj2) {
    if (isString(obj1)) {
        if (!isString(obj2)) {
            return false;
        } else {
            if (obj1 !== obj2) return false;
        }
    }

    if (isNumber(obj1)) {
        if (!isNumber(obj2)) {
            return false;
        } else {
            if (obj1 !== obj2) return false;
        }
    }

    if (isBoolean(obj1)) {
        if (!isBoolean(obj2)) {
            return false;
        } else {
            if (obj1 !== obj2) return false;
        }
    }

    if (isUndefined(obj1)) {
        if (!isUndefined(obj2)) {
            return false;
        } else {
            if (obj1 !== obj2) return false;
        }
    }

    if (isNull(obj1)) {
        if (!isNull(obj2)) {
            return false;
        } else {
            if (obj1 !== obj2) return false;
        }
    }

    if (isObject(obj1)) {
        if (!isObject(obj2)) {
            return false;
        } else {
            const keys1 = Object.keys(obj1);
            const keys2 = Object.keys(obj2);

            if (keys1.length !== keys2.length) return false;

            for (const key in obj1) {
                if (!keys2.some(it => it === key)) return false;
                if (!absoluteEqual(obj1[key], obj2[key])) return false;
            }
        }
    }

    if (isArray(obj1)) {
        if (!isArray(obj2)) {
            return false;
        } else {
            if (obj1.length !== obj2.length) return false;
            for (let i = 0; i < obj1.length; i++) {
                const elem = obj1[i];
                if (!obj2.some(it => absoluteEqual(it, elem))) return false;
            }
        }
    }
    return true;
}

//
function diffJsonArray (arr1, arr2) {
    const updateArray = [];
    const deleteArray = [];
    const inertArray = [];
    // 对数组进行排序
    const compareArr1 = JSON.parse(JSON.stringify(arr1));
    const compareArr2 = JSON.parse(JSON.stringify(arr2));
    // 比较数组长度
    if (compareArr1.length !== compareArr2.length) {
        if (compareArr1.length > compareArr2.length) {
            for (let i = compareArr2.length; i < compareArr1.length; i++) {
                const element = compareArr1[i];
                deleteArray.push({
                    type: 'delete',
                    element
                });
                compareArr1.splice(i, 1);
                i--;
            }
        } else {
            for (let i = compareArr1.length; i < compareArr2.length; i++) {
                const element = compareArr2[i];
                inertArray.push({
                    element
                });
                compareArr2.splice(i, 1);
                i--;
            }
        }
    }
    // 对比每个值
    for (let i = 0; i < compareArr1.length; i++) {
        const node1 = compareArr1[i];
        const node2 = compareArr2[i];
        if (!absoluteEqual(node1, node2)) {
            updateArray.push({
                index: i,
                origin: node1,
                current: node2
            })
        }
    }
    return {
        update: updateArray,
        delete: deleteArray,
        insert: inertArray
    }
}

const current = [
    { a: true, b: [1, 2], c: { f: { g: 8 } }, field: 'name' },
    { a: false, b: [3, 4], c: { f: { g: 5 } }, field: 'age' },
    { a: true, b: [5], c: { f: { g: 2 } }, field: 'address' }
];
const target = [
    { a: false, b: [3, 4], c: { f: { g: 5 } }, field: 'gender' },
    { a: true, b: [1, 2], c: { f: { g: 7 } }, field: 'name' },
    { a: true, b: [5], c: { f: { g: 2 } }, field: 'address' }
];
console.info(diffJsonArray(current, target));
console.info(diffJsonArray(jsonArr1, jsonArr2));
console.info(diffJsonArray(jsonArr1, jsonArr3));
console.info(diffJsonArray(jsonArr1, jsonArr4));