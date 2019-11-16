
export function validate_sgmobilenum(mobilenum) {
    let error = 0;
    const MOBNUM = mobilenum.trim();
    const MOBNUMLEN = MOBNUM.length;
    console.log('Mobile Number ',MOBNUM);
    console.log('Length Mobile Number ',MOBNUMLEN);
    if(MOBNUM === "") { error++; } else {
        if (MOBNUMLEN === 8) { 
            const fir_char = MOBNUM.charAt(0);
            if (fir_char ==="8" || fir_char ==="9") {
                //
            } else { error++; }
        } else if (MOBNUMLEN === 10) { 
            const begin_char = MOBNUM.substring(0,2);
            const fir_char = MOBNUM.charAt(2);
            if (begin_char === "65") {
                if (fir_char ==="8" || fir_char ==="9") {
                    //
                } else { error++; }
            } else { error++;}
        } else if (MOBNUMLEN === 11) { 
            const begin_char = MOBNUM.substring(0,3);
            const fir_char = MOBNUM.charAt(3);
            if (begin_char === "+65") {
                if (fir_char ==="8" || fir_char ==="9") {
                    //
                } else { error++; }
            } else { error++; }
        } else { error++; }
    }
    return error;
}

//                MOBNUM.split("").map((key) => {
//                    console.log(key);
//                });