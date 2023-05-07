const MULTIPLICATIVE_INVERSE_TABLE = [];
const AFFINE_MATRIX = [];
const bin_of_hex_63 = zeroPad( hex2bin("63"), 8 );
const REDUCING_POLYNOMIAL = "100011011";
const S_BOX = [];
const INVERSE_S_BOX = [];
const ROUND_CONSTANT = [];
const FIXED_MATRIX = [];
const INVERSE_FIXED_MATRIX = [];

let arr = ["02", "03", "01", "01"];
let arr2 = ["0e", "0b", "0d", "09"];

for (let i = 0; i < 4; i++) {
    FIXED_MATRIX[i] = [];
    INVERSE_FIXED_MATRIX[i] = [];
    for (let j = 0; j < 4; j++) {
        FIXED_MATRIX[i][j] = arr[mod2( (j - i), 4 )];
        INVERSE_FIXED_MATRIX[i][j] = arr2[mod2( (j - i), 4 )];
    }
}

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

for (let i = 0; i < ROUND_CONSTANT.length; i++) {
    let temp = bin2hex( ROUND_CONSTANT[i] );
    ROUND_CONSTANT[i] = hex2bin( temp )
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
        ] = zeroPad( i.toString(bin_of_hex_63.length * 2) + j.toString(bin_of_hex_63.length * 2), 2 );
    }
}

// let key_hex_16 = "000102030405060708090a0b0c0d0e0f";
// let key_hex_24 = "000102030405060708090a0b0c0d0e0f1011121314151617";
let key_hex_32 = "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f";
let N = (key_hex_32.length / 2) / 4;
let keyMatrix = [];

let count = 0;

for (let i = 0; i < N; i++)
    keyMatrix[i] = [];

for (let i = 0; i < N; i++)
    for (let j = 0; j < 4; j++) {
        keyMatrix[i][j] = key_hex_32[count] + key_hex_32[count + 1];
        count += 2;
    }

let plainMatrix = [
    ["00", "11", "22", "33"], 
    ["44", "55", "66", "77"], 
    ["88", "99", "aa", "bb"], 
    ["cc", "dd", "ee", "ff"]
];

let lmao = [
    ["8e", "a2", "b7", "ca"], 
    ["51", "67", "45", "bf"], 
    ["ea", "fc", "49", "90"], 
    ["4b", "49", "60", "89"]
]

// let cipherMatrix = encrypt(plainMatrix, keyMatrix);

// console.table( cipherMatrix );
// console.table( decrypt256( lmao, keyMatrix) );