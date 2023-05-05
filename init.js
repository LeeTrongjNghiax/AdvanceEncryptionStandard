const MULTIPLICATIVE_INVERSE_TABLE = [];
const AFFINE_MATRIX = [];
const bin_of_hex_63 = zeroPad( hex2bin("63"), 8 );
const REDUCING_POLYNOMIAL = "100011011";
const S_BOX = [];
const INVERSE_S_BOX = [];
const ROUND_CONSTANT = [];

for (let i = 0; i < 10; i++) {
    if (i == 0)
        ROUND_CONSTANT[i] = hex2bin("1");
    else {
        if ( ROUND_CONSTANT[i - 1] < hex2bin("80") )
            ROUND_CONSTANT[i] = multiplyingPolynomials(
                hex2bin("2"), 
                ROUND_CONSTANT[i - 1]
            );
        else
            ROUND_CONSTANT[i] = xoringPolynomials( 
                multiplyingPolynomials(
                    hex2bin("2"), 
                    ROUND_CONSTANT[i - 1]
                ), 
                hex2bin("11b") 
            );
    }
}

for (let i = 0; i < bin_of_hex_63.length; i++) {
    AFFINE_MATRIX[i] = [];

    for (let j = 0; j < bin_of_hex_63.length; j++)
        AFFINE_MATRIX[i][j] = 1;

    for (let j = 0; j < 3; j++) 
        AFFINE_MATRIX[i][(j + i + 1) % bin_of_hex_63.length] = 0; 
};

for (let i = 0; i < bin_of_hex_63.length * 2; i++)
    INVERSE_S_BOX[i] = [];

for (let i = 0; i < bin_of_hex_63.length * 2; i++) {
    MULTIPLICATIVE_INVERSE_TABLE[i] = [];
    S_BOX[i] = [];
    
    for (let j = 0; j < bin_of_hex_63.length * 2; j++) {
        MULTIPLICATIVE_INVERSE_TABLE[i][j] = zeroPad( 
            bin2hex( 
                multiplicativeInverseOfPolynomials( 
                    hex2bin(i.toString(bin_of_hex_63.length * 2) + j.toString(bin_of_hex_63.length * 2)), 
                    REDUCING_POLYNOMIAL
                ) 
            ), 
            2
        );

        S_BOX[i][j] = zeroPad(
            bin2hex(
                matrixBinaryMatrix(
                    matrixMultiplyMatrix(
                        AFFINE_MATRIX, 
                        zeroPad( 
                            hex2bin( MULTIPLICATIVE_INVERSE_TABLE[i][j] ), 
                            bin_of_hex_63.length 
                        ).split("").reverse().map(x => [+x])
                    ), 
                    bin_of_hex_63.split("").reverse().map(x => [x]), 
                    xor
                ).reverse().join("")
            ), 
            2
        );

        INVERSE_S_BOX[ 
            parseInt( zeroPad(S_BOX[i][j], 2)[0], bin_of_hex_63.length * 2 ) 
        ][ 
            parseInt( zeroPad(S_BOX[i][j], 2)[1], bin_of_hex_63.length * 2 ) 
        ] = i.toString(bin_of_hex_63.length * 2) + j.toString(bin_of_hex_63.length * 2);
    }
}

// console.table(MULTIPLICATIVE_INVERSE_TABLE);
console.table(S_BOX);
// console.table(INVERSE_S_BOX);

let key_hex = "2b7e151628aed2a6abf7158809cf4f3c";
let key = "satishcjisboringqwer";
let N = key_hex.length / 2 / 4;
let keyMatrix = [];
let count = 0;

for (let i = 0; i < N; i++)
    keyMatrix[i] = [];

for (let i = 0; i < key_hex.length / 2 / N; i++)
    for (let j = 0; j < N; j++) {
        // keyMatrix[i][j] = key[count].charCodeAt(0).toString(16);
        keyMatrix[i][j] = key_hex[count] + key_hex[count + 1];
        count += 2;
    }

console.table( keyMatrix );

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

createRoundKey = key => {
    let w4 = [];
    let w5 = [];
    let w6 = [];
    let w7 = [];
    let r = 11;

    let temp = JSON.parse( JSON.stringify( key[3] ) ) ;
    let w0_text = "";
    let w1_text = "";
    let w2_text = "";
    let w3_text = "";
    let g_text = ""

    g( temp, 0 ).map(x => g_text += zeroPad( hex2bin(x), 8 ));
    key[0].map(x => w0_text += zeroPad( hex2bin(x), 8 )); 
    key[1].map(x => w1_text += zeroPad( hex2bin(x), 8 )); 
    key[2].map(x => w2_text += zeroPad( hex2bin(x), 8 )); 
    key[3].map(x => w3_text += zeroPad( hex2bin(x), 8 )); 

    let w4_text = xoringPolynomials(
        w0_text, 
        g_text
    );
    let w5_text = xoringPolynomials(
        w1_text, 
        w4_text
    );
    let w6_text = xoringPolynomials(
        w2_text, 
        w5_text
    );
    let w7_text = xoringPolynomials(
        w3_text, 
        w6_text
    );

    for (let i = 0; i < 32 / 8; i++)
        w4.push( zeroPad( bin2hex( w4_text.substring(i * 8, i * 8 + 8) ), 2 ) );

    for (let i = 0; i < 32 / 8; i++)
        w5.push( zeroPad( bin2hex( w5_text.substring(i * 8, i * 8 + 8) ), 2 ) );

    for (let i = 0; i < 32 / 8; i++)
        w6.push( zeroPad( bin2hex( w6_text.substring(i * 8, i * 8 + 8) ), 2 ) );

    for (let i = 0; i < 32 / 8; i++)
        w7.push( zeroPad( bin2hex( w7_text.substring(i * 8, i * 8 + 8) ), 2 ) );

    console.table( key );
    return [w4, w5, w6, w7];
}

createRoundKey2 = key => {
    let round_key = [];
    let r = 11;

    for (let i = 0; i < 4 * r; i++) {
        round_key[i] = [];
        for (let j = 0; j < 4; j++)
            round_key[i][j] = [];
    }

    for (let i = 0; i < 4 * r; i++) {
        if (i == 0) {
            for (let j = 0; j < 4; j++)
                for (let k = 0; k < 4; k++)
                    round_key[i][j][k] = key[j][k];
        } else {
            for (let j = 0; j < 4; j++) {
                if (j == 0) {
                    let temp = JSON.parse( JSON.stringify( round_key[i - 1][3] ) );
                    
                    let g_text = "";
                    g( temp, i - 1 ).map(x => g_text += zeroPad( hex2bin(x), 8 ));

                    let w0_text = "";
                    round_key[i - 1][0].map(x => w0_text += zeroPad( hex2bin(x), 8 )); 

                    let w4_text = xoringPolynomials(
                        w0_text, 
                        g_text
                    );

                    for (let k = 0; k < 32 / 8; k++)
                        round_key[i][j].push( zeroPad( bin2hex( w4_text.substring(k * 8, k * 8 + 8) ), 2 ) );
                } else {
                    let w_pre_text = "";
                    round_key[i - 1][j].map(x => w_pre_text += zeroPad( hex2bin(x), 8 ));

                    let w_curr_text = "";
                    round_key[i][j - 1].map(x => w_curr_text += zeroPad( hex2bin(x), 8 ));

                    let w5_text = xoringPolynomials(
                        w_pre_text, 
                        w_curr_text
                    );

                    for (let k = 0; k < 32 / 8; k++)
                        round_key[i][j].push( zeroPad( bin2hex( w5_text.substring(k * 8, k * 8 + 8) ), 2 ) );
                }
            }
        }
    }

    return round_key;
}

console.log( createRoundKey2( keyMatrix ) );