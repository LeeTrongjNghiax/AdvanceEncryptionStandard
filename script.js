add = (a, b) => a + b;
multi = (a, b) => a * b;
mod = (a, b) => a % b;
mod2 = (a, b) => ((b + a % b) % b);
xor = (a, b) => {
    if (a == b) 
        return 0;
    else 
        return 1;
}

zeroPad = (num, places) => String(num).padStart(places, '0');

removeZero = str => {
    while (str[0] == "0")
        str = str.substring(1);

    if (str == "") 
        return "0";
    return str;
}

hex2bin = hex => {
    let bin = (parseInt(hex, 16).toString(2)).padStart(8, '0');
    while (bin[0] == "0") 
        bin = bin.substring(1);

    return bin;
}

bin2hex = bin => Number(parseInt(bin, 2)).toString(16);

extendedEuclideanalgorithm = (a, b) => {
    let r = [a, b]
    let s = [1, 0];
    let t = [0, 1];
    let q = [];
    let i = 2;

    while ( r[r.length - 1] != 0 ) {
        q[i - 1] = Math.floor(r[i - 2] / r[i - 1]);
        r[i] = r[i - 2] - q[i - 1] * r[i - 1];
        s[i] = s[i - 2] - q[i - 1] * s[i - 1];
        t[i] = t[i - 2] - q[i - 1] * t[i - 1];
        i++;
    }

    return {
        x: s[s.length - 2], 
        y: t[t.length - 2], 
        gcd: r[r.length - 3]
    };
}

multiplicativeInverse = (a, b) => extendedEuclideanalgorithm(a, b).x + b;

extendedEuclideanalgorithmOfPolynomials = (a, b) => {
    let r = [a, b]
    let s = ["1", "0"];
    let t = ["0", "1"];
    let string = "";
    let i = 2;

    while ( r[r.length - 1] != "0" ) {
        let q = dividePolynomials(r[i - 2], r[i - 1]).quotient;

        r[i] = addingPolynomials(r[i - 2], multiplyingPolynomials(q, r[i - 1]))  
        s[i] = addingPolynomials(s[i - 2], multiplyingPolynomials(q, s[i - 1]));
        t[i] = addingPolynomials(t[i - 2], multiplyingPolynomials(q, t[i - 1]));
        i++;
    }

    return { r, s, t, string };
}

addingPolynomials = (p1, p2) => {
    if (p1 == "0") return p2;
    if (p2 == "0") return p1;

    let p3 = [];

    let a = p1.split("").reverse().map(x => +x);
    let b = p2.split("").reverse().map(x => +x);

    if (a.length > b.length) {
        for (let i = b.length; i < a.length; i++) {
            b[i] = 0;
        }
    } else {
        for (let i = a.length; i < b.length; i++) {
            a[i] = 0;
        }
    }

    for (let i = 0; i < Math.max(p1.length, p2.length); i++)
        p3.push( xor( a[i], b[i]) );

    let t = p3.reverse().join();

    // return p3.reverse().join("");
    return dividePolynomials( removeZero(t), "100011011" ).remainder;
}

xoringPolynomials = (p1, p2) => {
    let a = p1.split("").reverse().map(x => +x);
    let b = p2.split("").reverse().map(x => +x);
    let p3 = [];

    for (let i = 0; i < Math.max(p1.length, p2.length); i++)
        p3.push( xor( a[i], b[i]) );

    return p3.reverse().join("");
}

multiplyingPolynomials = (p1, p2) => {
    if (p1 == "0" || p2 == "0") return "0";
    if (p1 == "1") return p2;
    if (p2 == "1") return p1;

    let arr = [];
    let result = [];
    let a, b;

    if ( p1.length > p2.length ) {
        a = p1.split("").reverse().map(x => +x);
        b = p2.split("").reverse().map(x => +x);
    } else {
        b = p1.split("").reverse().map(x => +x);
        a = p2.split("").reverse().map(x => +x);
    }

    for (let i = 0; i < a.length; i++)
        if ( a[i] == 1 )
            for (let j = 0; j < b.length; j++)
                if ( b[j] == 1 )
                    arr.push( i + j );

    for (let i = 0; i < Math.max(...arr) + 1; i++)
        result[i] = 0;

    for (let i = 0; i < arr.length; i++)
        result[ arr[i] ] = (result[ arr[i] ] + 1) % 2;

    let dividend = JSON.parse( JSON.stringify(result) ).reverse() ;

    while (dividend[0] == 0)
        dividend.shift();

    return dividend.join("")
    // return dividePolynomials( dividend.reverse().join(""), "100011011" ).remainder;
}

dividePolynomials = (a, b) => {
    if ( b == "1" || a == "0" ) return {
        quotient: a, 
        remainder: "0"
    }

    let dividend = a.split("").reverse().map(x => +x);
    let divisor = b.split("").reverse().map(x => +x);
    let remainder = JSON.parse( JSON.stringify(dividend) );
    let quotient = [];

    for (let i = 0; i < remainder.length - divisor.length; i++) 
        quotient[i] = 0;

    while ( remainder.length >= divisor.length ) {
        let q0 = remainder.length - divisor.length;

        quotient[ q0 ] = 1;

        let c = [];

        for (let i = 0; i < remainder.length; i++) 
            c[i] = 0;

        for (let i = 0; i < divisor.length; i++)
            if ( divisor[i] == 1 )
                c[ i + q0 ] = 1;

        for (let i = 0; i < remainder.length; i++)
            remainder[i] = (remainder[i] == c[i]) ? 0 : 1;

        while (remainder[remainder.length - 1] == 0 && remainder.length != 1)
            remainder.pop();
    }

    let r = remainder.reverse();

    while (r[r.length - 1] == 0)
        r.shift();

    return {
        quotient: quotient.reverse().join(""), 
        remainder: r.join("")
    };
}

multiplicativeInverseOfPolynomials = (a, b) => {
    if (a == "") return "0";
    for (let i = 0; i < 16 * 16; i++)
        if ( dividePolynomials( multiplyingPolynomials(i.toString(2), a), b ).remainder == "1" )
            return i.toString(2);
}

numberBinaryMatrix = (number, matrix, expression) => matrix.map(
    x => x.map(
        y => expression(y, number)
    )
)

matrixBinaryMatrix = (m1, m2, expression) => {
    let m3 = [];
    for (let i = 0; i < m1.length; i++) {
        m3[i] = []
    }

    for (let i = 0; i < m1.length; i++) {
        for (let j = 0; j < m1[0].length; j++) {
            m3[i][j] = expression(m1[i][j], m2[i][j]);
        }
    }

    return m3;
}

matrixMultiplyMatrix = (m1, m2) => {
    let m3 = [];
    for (let i = 0; i < m1.length; i++) {
        m3[i] = []
    }

    for (let i = 0; i < m1.length; i++) {
        for (let j = 0; j < m2[0].length; j++) {
            let sum = 0
            for (let k = 0; k < m2.length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            m3[i][j] = sum % 2;
        }
    }

    return m3;
}

transposeMatrix = matrix => matrix[0].map(
    (_, colIndex) => matrix.map(
        row => row[colIndex]
    )
);

smallerMatrix = (matrix, i, j) => {
    let matrix2 = [];

    matrix.map((row, x) => {
        if (x != i) {
            let rows = [];
            row.map((index, y) => {
                if (y != j) {
                    rows.push(index);
                }
            })
            matrix2.push(rows);
        }
    })

    return matrix2;
}

getDet = matrix => {
    if (matrix.length == 1) return matrix[0][0];
    let sum = 0;

    for (let i = 0; i < matrix.length; i++) {
        sum += Math.pow(-1, 1 + (i + 1)) * matrix[0][i] * getDet(smallerMatrix(matrix, 0, i));
    }

    return sum;
}

cofactorMatrix = matrix => {
    let c = Array(matrix.length).fill(null).map( () => Array(matrix.length).fill(null));

    matrix.map((row, i) => {
        row.map((_, j) => {
            c[i][j] = Math.pow(-1, i + j) * getDet(smallerMatrix(matrix, i, j));
        })
    })
    
    return c;
}

inversedMatrix = matrix => {
    if (getDet(matrix) == 0) return null;

    return numberBinaryMatrix(
        1 / getDet(matrix), 
        transposeMatrix( cofactorMatrix(matrix) ), 
        multi
    )
}

