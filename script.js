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
    let bin = (parseInt(hex, 16).toString(2));

    while (bin[0] == "0") 
        bin = bin.substring(1);

    return bin;
}

bin2hex = bin => parseInt(bin, 2).toString(16);

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

    if (a.length > b.length)
        for (let i = b.length; i < a.length; i++)
            b[i] = 0;
    else
        for (let i = a.length; i < b.length; i++)
            a[i] = 0;

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
    let quotient = [1];

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

    return {
        quotient: quotient.reverse().join(""), 
        remainder: r.join("")
    };
}

moduloPolynomial = p1 => {
    let arr = p1.split("").map(x => +x);
    let arr2 = [];
    let power = [];

    for (let i = 0; i < 4 - 1; i++)
        arr2[i] = "0";

    for (let i = 0; i < arr.length; i++)
        if (arr[i] == "1")
            power.push(i);

    for (let i = 0; i < power.length; i++)
        arr2[i % 4] = "1";

    return arr2.join("");
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
    
    for (let i = 0; i < m1.length; i++)
        m3[i] = [];

    for (let i = 0; i < m1.length; i++)
        for (let j = 0; j < m1[0].length; j++)
            m3[i][j] = expression(m1[i][j], m2[i][j]);

    return m3;
}

hexMatrixBinaryhexMatrix = (m1, m2, expression) => {
    let m3 = [];
    
    for (let i = 0; i < m1.length; i++)
        m3[i] = [];

    for (let i = 0; i < m1.length; i++)
        for (let j = 0; j < m1[0].length; j++)
            m3[i][j] = zeroPad( bin2hex( expression(zeroPad( hex2bin( m1[i][j] ), 8 ), zeroPad( hex2bin( m2[i][j] ), 8 ) ) ), 2 );

    return m3;
}

matrixMultiplyMatrix = (m1, m2) => {
    let m3 = [];

    for (let i = 0; i < m1.length; i++)
        m3[i] = []

    for (let i = 0; i < m1.length; i++)
        for (let j = 0; j < m2[0].length; j++) {
            let sum = 0;

            for (let k = 0; k < m2.length; k++)
                sum += m1[i][k] * m2[k][j];

            m3[i][j] = sum % 2;
        }

    return m3;
}

matrixMultiplyMatrix2 = (m1, m2) => {
    let m3 = [];

    for (let i = 0; i < m1.length; i++)
        m3[i] = []

    for (let i = 0; i < m1.length; i++)
        for (let j = 0; j < m2[0].length; j++) {
            let sum = zeroPad( 
                dividePolynomials( 
                    multiplyingPolynomials(
                        hex2bin( m1[i][0] ), 
                        hex2bin( m2[0][j] ) 
                    ), 
                    REDUCING_POLYNOMIAL
                ).remainder, 
                8 
            );

            for (let k = 1; k < m2.length; k++) {
                remain = zeroPad(
                    dividePolynomials( 
                        multiplyingPolynomials(
                            hex2bin( m1[i][k] ), 
                            hex2bin( m2[k][j] ) 
                        ), 
                        REDUCING_POLYNOMIAL
                    ).remainder, 
                    8
                );
                
                sum = xoringPolynomials(sum, remain);
            }

            m3[i][j] = zeroPad( bin2hex( sum ), 2 );
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
                if (y != j)
                    rows.push(index);
            })
            matrix2.push(rows);
        }
    })

    return matrix2;
}

getDet = matrix => {
    if (matrix.length == 1) return matrix[0][0];
    let sum = 0;

    for (let i = 0; i < matrix.length; i++)
        sum += Math.pow(-1, 1 + (i + 1)) * matrix[0][i] * getDet(smallerMatrix(matrix, 0, i));

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

rotWord = arr => arr.push( arr.shift() )

subWord = arr => arr.map(
    x => S_BOX[ 
        parseInt( zeroPad(x, 2)[0], bin_of_hex_63.length * 2 ) 
    ][ 
        parseInt( zeroPad(x, 2)[1], bin_of_hex_63.length * 2 ) 
    ]
)

g = (arr, i) => {
    rotWord( arr );
    arr = subWord( arr );

    let str = "";
    arr.map(x => str += zeroPad( hex2bin( x ), 8 ) );

    let str2 = zeroPad( ROUND_CONSTANT[i], 8 );
    for (let j = 0; j < 3; j++)
        str2 += "00000000";

    let str3 = xoringPolynomials(str, str2);

    let arr2 = [];

    for (let i = 0; i < str3.length / 8; i++) {
        arr2.push( zeroPad( bin2hex( str3.substring(i * 8, i * 8 + 8) ), 2 ) );
    }

    return arr2;
}

createRoundKey2 = key_hex => {
    let round_key = [];
    let N = key_hex.length;
    let r = (key_hex.length == 4) ? 11 :
        (key_hex.length == 6) ? 9 : 8;

    for (let i = 0; i < r; i++) {
        round_key[i] = [];
        for (let j = 0; j < N; j++)
            round_key[i][j] = [];
    }

    for (let i = 0; i < r; i++) {
        if (i == 0) {
            for (let j = 0; j < N; j++)
                for (let k = 0; k < 4; k++)
                    round_key[i][j][k] = key_hex[j][k];
        } else {
            for (let j = 0; j < N; j++) {
                if (j == 0) {
                    let temp = JSON.parse( JSON.stringify( round_key[i - 1][N - 1] ) );
                    
                    let g_text = "";
                    g( temp, i - 1 ).map(x => g_text += zeroPad( hex2bin(x), 8 ));

                    let w0_text = "";
                    round_key[i - 1][0].map(x => w0_text += zeroPad( hex2bin(x), 8 )); 

                    let w4_text = xoringPolynomials(
                        w0_text, 
                        g_text
                    );

                    for (let k = 0; k < 4; k++)
                        round_key[i][j].push( zeroPad( bin2hex( w4_text.substring(k * 8, k * 8 + 8) ), 2 ) );
                } else if (N > 6 && j % 4 == 0) {
                    let temp = JSON.parse( JSON.stringify( round_key[i][j - 1] ) );
                    
                    let g_text = "";
                    subWord( temp ).map(x => g_text += zeroPad( hex2bin(x), 8 ));

                    let w0_text = "";
                    round_key[i - 1][j].map(x => w0_text += zeroPad( hex2bin(x), 8 )); 

                    let w5_text = xoringPolynomials(
                        g_text, 
                        w0_text
                    );

                    for (let k = 0; k < 4; k++)
                        round_key[i][j].push( zeroPad( bin2hex( w5_text.substring(k * 8, k * 8 + 8) ), 2 ) );
                } else {
                    let w_pre_text = "";
                    round_key[i - 1][j].map(x => w_pre_text += zeroPad( hex2bin(x), 8 ));

                    let w_curr_text = "";
                    round_key[i][j - 1].map(x => w_curr_text += zeroPad( hex2bin(x), 8 ));

                    let w5_text = xoringPolynomials(
                        w_pre_text, 
                        w_curr_text
                    );

                    for (let k = 0; k < 4; k++)
                        round_key[i][j].push( zeroPad( bin2hex( w5_text.substring(k * 8, k * 8 + 8) ), 2 ) );
                }
            }
        }
    }

    return round_key;
}

createRoundKey = key_hex => {
    let round_key = [];
    let N = key_hex.length;
    let r = (key_hex.length == 4) ? 11 :
        (key_hex.length == 6) ? 13 : 15;

    for (let i = 0; i < 4 * r; i++) {
        round_key[i] = [];
    }

    for (let i = 0; i < 4 * r; i++) {
        if (i < N) {
            for (let j = 0; j < 4; j++)
                round_key[i][j] = key_hex[i][j];
        } else {
            if (i % N == 0) {
                let temp = JSON.parse( JSON.stringify( round_key[i - 1] ) );
                
                let g_text = "";
                let gf = g( temp, i / N - 1);
                gf.map(x => g_text += zeroPad( hex2bin(x), 8 ));

                let w0_text = "";
                round_key[i - N].map(x => w0_text += zeroPad( hex2bin(x), 8 )); 

                let w4_text = xoringPolynomials(
                    w0_text, 
                    g_text
                );

                for (let j = 0; j < 4; j++)
                    round_key[i].push( 
                        zeroPad( 
                            bin2hex( 
                                w4_text.substring(j * 8, j * 8 + 8) 
                            ), 
                            2 
                        ) 
                    );

                
            } else if ( N > 6 && i % N == 4 ) {
                let temp = JSON.parse( JSON.stringify( round_key[i - 1] ) );
                    
                let g_text = "";
                subWord( temp, i - N ).map(x => g_text += zeroPad( hex2bin(x), 8 ));

                let w0_text = "";
                round_key[i - N].map(x => w0_text += zeroPad( hex2bin(x), 8 )); 

                let w4_text = xoringPolynomials(
                    w0_text, 
                    g_text
                );

                for (let j = 0; j < 4; j++)
                    round_key[i].push( 
                        zeroPad( 
                            bin2hex( 
                                w4_text.substring(j * 8, j * 8 + 8) 
                            ), 
                            2 
                        ) 
                    );
            } else {
                let w_pre_text = "";
                round_key[i - 1].map(x => w_pre_text += zeroPad( hex2bin(x), 8 ));

                let w_curr_text = "";
                round_key[i - N].map(x => w_curr_text += zeroPad( hex2bin(x), 8 ));

                let w5_text = xoringPolynomials(
                    w_pre_text, 
                    w_curr_text
                );

                for (let j = 0; j < 4; j++)
                    round_key[i].push( 
                        zeroPad( 
                            bin2hex( 
                                w5_text.substring(j * 8, j * 8 + 8) 
                            ), 
                            2 
                        ) 
                    );
            }
        }
    }

    return round_key;
}

subBytes = arr => {
    let arr2 = [];

    for (let i = 0; i < arr.length; i++)
        arr2[i] = [];
    
    arr.map((x, i) => {
        x.map((y, j) => arr2[i][j] = S_BOX[ 
            parseInt( arr[i][j][0], bin_of_hex_63.length * 2 ) 
        ][ 
            parseInt( arr[i][j][1], bin_of_hex_63.length * 2 ) 
        ])
    });

    return arr2;
}

inverseSubBytes = arr => {
    let arr2 = [];

    for (let i = 0; i < arr.length; i++)
        arr2[i] = [];
    
    arr.map((x, i) => {
        x.map((y, j) => arr2[i][j] = INVERSE_S_BOX[ 
            parseInt( arr[i][j][0], bin_of_hex_63.length * 2 ) 
        ][ 
            parseInt( arr[i][j][1], bin_of_hex_63.length * 2 ) 
        ])
    });

    return arr2;
}

shiftRows = arr => {
    let arr2 = [];

    for (let i = 0; i < arr.length; i++)
        arr2[i] = [];
    
    arr.map((x, i) => {
        x.map((y, j) => arr2[i][j] = arr[i][(j + i) % 4])
    });

    return arr2;
}

inverseShiftRows = arr => {
    let arr2 = [];

    for (let i = 0; i < arr.length; i++)
        arr2[i] = [];
    
    arr.map((x, i) => {
        x.map((y, j) => arr2[i][j] = arr[i][mod2(j - i, 4)])
    });

    return arr2;
}

mixColumn = arr => {
    let arr2 = matrixMultiplyMatrix2( FIXED_MATRIX, arr );

    return arr2;
}

inverseMixColumn = arr => {
    let arr2 = matrixMultiplyMatrix2( INVERSE_FIXED_MATRIX, arr );

    return arr2;
}

matrixToString = arr => {
    let str = '';

    for (let i = 0; i < arr.length; i++)
        for (let j = 0; j < arr[0].length; j++)
            str += arr[i][j];

    return str;
}

encrypt = (plainMatrix, keyMatrix) => {
    let r = (keyMatrix.length == 4) ? 11 :
        (keyMatrix.length == 6) ? 13 : 15;

    let outputMatrix = JSON.parse( JSON.stringify( plainMatrix ) );
    let extendedKey = createRoundKey( keyMatrix );

    // console.log( matrixToString( outputMatrix ) );
    // console.log( matrixToString( extendedKey.slice(0, 4) ) );

    outputMatrix = JSON.parse( 
        JSON.stringify( 
            hexMatrixBinaryhexMatrix(
                outputMatrix, 
                extendedKey.slice(0, 4), 
                xoringPolynomials 
            ) 
        ) 
    );

    // console.log( matrixToString( outputMatrix ) );

    for (let i = 1; i < r; i++) {
        switch (i) {
            case r - 1:
                // console.log( matrixToString(
                //     transposeMatrix(
                //         hexMatrixBinaryhexMatrix( 
                //                 shiftRows(
                //                     transposeMatrix(
                //                         subBytes(
                //                             outputMatrix
                //                         )
                //                     )
                //                 )
                //             , 
                //             transposeMatrix( extendedKey.slice(i * 4, i * 4 + 4) ), 
                //             xoringPolynomials
                //         ) 
                //     )
                // ) );
                outputMatrix = JSON.parse( 
                    JSON.stringify( 
                        transposeMatrix(
                            hexMatrixBinaryhexMatrix( 
                                    shiftRows(
                                        transposeMatrix(
                                            subBytes(
                                                outputMatrix
                                            )
                                        )
                                    )
                                , 
                                transposeMatrix( extendedKey.slice(i * 4, i * 4 + 4) ), 
                                xoringPolynomials
                            ) 
                        )
                    ) 
                );
                break;
            default: 
                // console.table( matrixToString(
                //     subBytes(
                //         outputMatrix
                //     )
                // ) );
                // console.log( matrixToString(
                //     transposeMatrix(
                //         shiftRows(
                //             transposeMatrix(
                //                 subBytes(
                //                     outputMatrix
                //                 )
                //             )
                //         )
                //     )
                // ) );
                // console.log( matrixToString( 
                //     transposeMatrix (
                //         mixColumn( 
                //             shiftRows(
                //                 transposeMatrix(
                //                     subBytes(
                //                         outputMatrix
                //                     )
                //                 )
                //             )
                //         )
                //     ) 
                // ) );
                // console.log( matrixToString( extendedKey.slice(i * 4, i * 4 + 4) ) );
                // console.log( matrixToString( 
                //     transposeMatrix(
                //         hexMatrixBinaryhexMatrix( 
                //             mixColumn( 
                //                 shiftRows(
                //                     transposeMatrix(
                //                         subBytes(
                //                             outputMatrix
                //                         )
                //                     )
                //                 )
                //             ), 
                //             transposeMatrix( extendedKey.slice(i * 4, i * 4 + 4) ), 
                //             xoringPolynomials
                //         ) 
                //     )
                // ) );
                outputMatrix = JSON.parse( 
                    JSON.stringify( 
                        transposeMatrix(
                            hexMatrixBinaryhexMatrix( 
                                mixColumn( 
                                    shiftRows(
                                        transposeMatrix(
                                            subBytes(
                                                outputMatrix
                                            )
                                        )
                                    )
                                ), 
                                transposeMatrix( extendedKey.slice(i * 4, i * 4 + 4) ), 
                                xoringPolynomials
                            ) 
                        )
                    ) 
                );
        }
    }

    return outputMatrix;
}

decrypt = (cipherMatrix, keyMatrix) => {
    let outputMatrix = JSON.parse( JSON.stringify( cipherMatrix ) );
    let extendedKey = createRoundKey( keyMatrix );
    let r = (keyMatrix.length == 4) ? 11 :
        (keyMatrix.length == 6) ? 13 : 15;

    // console.log( extendedKey );

    // console.log( matrixToString( transposeMatrix( outputMatrix ) ) );
    // console.log( matrixToString( 
    //     extendedKey.slice(-4) 
    // ) );

    outputMatrix = hexMatrixBinaryhexMatrix( 
        transposeMatrix( outputMatrix ), 
        extendedKey.slice(-4), 
        xoringPolynomials 
    );

    // console.log( matrixToString( outputMatrix ) );

    for (let i = r - 2; i > 0; i--) {
        // console.log( (i + 1) * 4 );
        // console.table( matrixToString( 
        //     transposeMatrix(
        //         inverseShiftRows( 
        //             transposeMatrix( outputMatrix ) 
        //         ) 
        //     )
        // ) );
        // console.log( matrixToString( 
        //         inverseSubBytes( 
        //             transposeMatrix(
        //                 inverseShiftRows( 
        //                     transposeMatrix( outputMatrix ) 
        //                 ) 
        //             )
        //         ) 
        //     ) 
        // );
        // console.log( matrixToString( extendedKey.slice((i) * 4, (i) * 4 + 4) ) );
        // console.log( matrixToString( 
        //     transposeMatrix( 
        //         hexMatrixBinaryhexMatrix( 
        //             transposeMatrix(
        //                 inverseSubBytes( 
        //                     transposeMatrix(
        //                         inverseShiftRows( 
        //                             transposeMatrix( outputMatrix ) 
        //                         ) 
        //                     )
        //                 )
        //             ), 
        //             transposeMatrix(
        //                 extendedKey.slice((i) * 4, (i) * 4 + 4)
        //             ), 
        //             xoringPolynomials 
        //         ) 
        //     ) 
        // ) );
        // console.log( matrixToString( 
        //     transposeMatrix( 
        //         inverseMixColumn(
                    
        //                 hexMatrixBinaryhexMatrix( 
        //                     transposeMatrix(
        //                         inverseSubBytes( 
        //                             transposeMatrix(
        //                                 inverseShiftRows( 
        //                                     transposeMatrix( outputMatrix ) 
        //                                 ) 
        //                             )
        //                         )
        //                     ), 
        //                     transposeMatrix(
        //                         extendedKey.slice((i) * 4, (i) * 4 + 4)
        //                     ), 
        //                     xoringPolynomials 
        //                 ) 
                    
        //         ) 
        //     ) 
        // ) );

        outputMatrix = JSON.parse( 
            JSON.stringify( 
                transposeMatrix( 
                    inverseMixColumn(         
                        hexMatrixBinaryhexMatrix( 
                            transposeMatrix(
                                inverseSubBytes( 
                                    transposeMatrix(
                                        inverseShiftRows( 
                                            transposeMatrix( outputMatrix ) 
                                        ) 
                                    )
                                )
                            ), 
                            transposeMatrix(
                                extendedKey.slice((i) * 4, (i) * 4 + 4)
                            ), 
                            xoringPolynomials 
                        ) 
                    ) 
                )
            ) 
        );
    }
    
    outputMatrix = JSON.parse( 
        JSON.stringify( 
            transposeMatrix( 
                hexMatrixBinaryhexMatrix( 
                    transposeMatrix(
                        inverseSubBytes( 
                            transposeMatrix(
                                inverseShiftRows( 
                                    transposeMatrix( outputMatrix ) 
                                ) 
                            )
                        )
                    ), 
                    transposeMatrix(
                        extendedKey.slice(0, 4)
                    ), 
                    xoringPolynomials 
                ) 
            )
        ) 
    );

    // console.log( outputMatrix );

    return transposeMatrix( outputMatrix );
}