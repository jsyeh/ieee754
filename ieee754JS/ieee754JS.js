// 作者: 葉正聖 jsyeh@mail.mcu.edu.tw
// 有網友遇到IEEE 754 計算的問題
// 所以我想把它畫出來, 方便理解
// 參考資料 https://en.wikipedia.org/wiki/IEEE_754
// 可以產生最大值、最小值。秀出2個float的加減乘除等
// float (32-bit), double (64-bit)
// Value = sign * exp * fraction
// float f = 0.15625; //Wikipedia用這個範例
// 網友用這個範例 https://www.youtube.com/watch?v=RuKkePyo9zk&t=1165s
var f;

// 小心前後位數的不同
var bit;
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function setup() {
    initializeFields();
    createCanvas(windowWidth, windowHeight);
    // https://stackoverflow.com/questions/10643754/convert-float-to-bits
    // LSB
    var N = FloatToIEEE(f);
    for (var i = 0; i < 32; i++) {
        bit[i] = (N >> i) & 0x01;
    }
}
function FloatToIEEE(f)
{//https://stackoverflow.com/questions/2003493/javascript-float-from-to-bits
    var buf = new ArrayBuffer(4);
    (new Float32Array(buf))[0] = f;
    return (new Uint32Array(buf))[0];
}
function draw() {
    background(255,255,191);
    if (mouseIsPressed && (mouseY < 50 || mouseY > 90)) {
        // 提示使用者可按中間
        fill(128, 128);
        noStroke();
        rect(0, 0, windowWidth, height);
    }
    textAlign(CENTER, CENTER);
    textSize(20);
    stroke(128);
    strokeWeight(1);
    for (var i = 0; i < 32; i++) {
        if (i < 1)
            fill(197, 252, 255);
        else if (i < 9)
            fill(160, 255, 197);
        else
            fill(255, 173, 173);
        //stroke(0);
        rect(10 + i * 30, 50, 30, 50);
        fill(0);
        text(bit[31 - i], 10 + i * 30 + 30 / 2, 50 + 50 / 2);
    // LSB: Least Significant Bit, LSB 最小位在最右邊,又 x86 是 Little Endian
    }
    textAlign(CENTER, BOTTOM);
    fill(0);
    text("sign", 10 + (1 + 0) * 30 / 2, 50);
    text("exponent (8 bits)", 10 + (9 + 1) * 30 / 2, 50);
    text("fraction (23 bits)", 10 + (32 + 9) * 30 / 2, 50);
    text("31", 10 + (1 + 0) * 30 / 2, 50 + 50 + 25);
    text("30", 10 + (2 + 1) * 30 / 2, 50 + 50 + 25);
    text("23", 10 + (9 + 8) * 30 / 2, 50 + 50 + 25);
    text("22", 10 + (10 + 9) * 30 / 2, 50 + 50 + 25);
    text("0", 10 + (32 + 31) * 30 / 2, 50 + 50 + 25);
    textAlign(LEFT, TOP);
    textSize(24);
    text("Step 1: sign part [" + bit[31] + "] is " + ((bit[31] == 0) ? "positive" : "negtive"), 10, 150);
    var step2 = bitInt(30, 23);
    text("Step 2: exp part [" + bitString(30, 23) + "] is " + step2, 10, 200);
    var step3 = step2 - 127;
    text("Step 3: exp-127 is " + step3, 10, 250);
    var last = 0;
    for (var i = 31; i >= 0; i--) {
        if (bit[i] == 1)
            last = i;
    }
    let step4 = "Step 4: mantissa part [" + bitString(22, last) + "] is \n" + mentissaString(last);
    text(step4, 10, 300, windowWidth - 10, 200);
    let step4Height = int(textWidth(mentissaString(last))/(windowWidth-10))*40;
    var step5 = (mentissa + 1);
    text("Step 5: add 1 to mantissa is " + step5, 10, 400+step4Height);
    let sign = (bit[31]==1)? "-" : "";
    text("Step 6: result is " + sign + step5 + " * 2^" + (bitInt(30, 23) - 127) + " = " + sign + (step5 * pow(2, step3)), 10, 450+step4Height);
  
}

function bitString(a, b) {
    var ans = "";
    for (var i = a; i >= b; i--) ans += bit[i];
    return ans;
}

function bitInt(a, b) {
    var ans = 0;
    for (var i = a; i >= b; i--) {
        ans *= 2;
        ans += bit[i];
    }
    return ans;
}

var mentissa;

var mentissaHeight;

function mentissaString(last) {
    var ans = "";
    var _mentissa = 0, div = 1;
    for (var i = 22; i >= last; i--) {
        div /= 2;
        if (bit[i] == 1) {
            ans += " +" + div;
            _mentissa += div;
        }
    }
    ans += " = " + _mentissa;
    mentissa = _mentissa;
    return ans;
}

function mousePressed() {
    if (mouseY > 50 && mouseY < 100) {
        var i = int( (mouseX-10) / 30);
        if (i > 31 || i < 0)
            return;
        bit[31 - i] = 1 - bit[31 - i];
    }
    //print( mouseX + "  " + mouseY);
    print(i);
}

function initializeFields() {
    f = 58.5;
    bit = new Array(32);
    mentissa = 0;
    mentissaHeight = 0;
}

