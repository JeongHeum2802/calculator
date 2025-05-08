document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('#buttons button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            // 숫자 버튼이 눌렸을 때
            if(value >= '0' && value <='9' ||
                value === '+' || value === '-' || value === '÷' || value === '×' || value === '%') {
                write(button);
            }
            else if(value === 'del') {
                deleteLast();
            }
            else if(value === '=') {
                operate();
            }
            else if(value === '.') {
                document.getElementById('display').value = document.getElementById('display').value +'.';
            }
            else if(value === 'A/C') {
                document.getElementById('display').value = '';
            }
        });
    });
});

// 값을 디스플레이 마지막에 추가하는 함수
function write(btn) {
    const display = document.getElementById("display");
    const newText = btn.textContent;
    const oldText = display.value;
    const lastText = oldText.charAt(oldText.length - 1);

    //예외 처리리
    
    if(lastText === '') { // 처음 값 입력
        if(newText === '÷' || newText === '×' || newText === '0') {
            return;
        }
        display.value = newText;
    }
    else if(lastText === '+' || lastText === '-' || lastText === '÷' || lastText === '×' || lastText === '%') { // 전이 연산자자
            if(newText === '+' || newText === '-' || newText === '÷' || newText === '×' || newText === '%') {
                display.value = oldText.substring(0,oldText.length-1) + newText;
            }
            else {
                display.value = oldText + newText;
            }
    }
    else {
        display.value = oldText + newText;
    }
}

// 마지막 값을 지우는 함수
function deleteLast() {
    const display = document.getElementById('display');
    display.value = display.value.substring(0,display.value.length - 1);
}

// 계산 후 디스플레이에 숫자를 띄움
function operate() {
    const display = document.getElementById('display');

    let text = display.value.split('');
    // 끝이 연산자면 삭제 후 계산
    const lastText = text[text.length-1];
    if(lastText === '+' || lastText === '-' || lastText === '÷' || lastText === '×' || lastText === '%') {
        text.pop();
    }
    text = text.map((x) => {
        if(x >= '0' && x <= '9') {
            return parseInt(x);
        }
        else {
            return x;
        }
    });
    
    // 숫자를 묶어서 middle 리스트에 중위식 저장장
    let infix = [];
    let num = 0, decimal = 0, yesdecimal = false, decimalCnt = 0;
  
    for(let i = 0; i < text.length; i++) {
        if(text[i] === '.') { // 소주점 모드 활성화
            yesdecimal = true;
        }
        else if(text[i] >= 0 && text[i] <= 9) { // 정수를 입력받음
            if(yesdecimal === false) { // 소수점 모드가 아니면
                num *= 10;
                num += text[i];
            }
            else if(yesdecimal === true) { // 소수점 모드이면
                decimalCnt += 1;
                decimal *= 10;
                decimal += text[i];
            }
        }
        else { // 연산자가 나오면 num + decemal 을 넣음
            
            for(let i = 0; i < decimalCnt; i++) { 
                decimal /= 10;
            }
            num = num + decimal;
            infix.push(num);
            num = 0;
            yesdecimal = false;
            decimal = 0;
            decimalCnt = 0;
            infix.push(text[i]);
        }   
    }
    if(yesdecimal === true) {
        for(let i = 0; i < decimalCnt; i++) { 
            decimal /= 10;
        }
        num = num + decimal;
    }
    infix.push(num);
    
    // 중위식 계산
    let value = {
        '+' : 1,
        '-' : 1,
        '÷' : 2,
        '×' : 2,
        '%' : 3,
    };
    
    let operatorStack = [];
    let numStack = [];
    for(let i = 0; i < infix.length; i++) {
        const nowText = infix[i];

        if(nowText === '+' || nowText === '-' || nowText === '÷' || nowText === '×' || nowText === '%') {
            while(operatorStack.length > 0 && value[operatorStack[operatorStack.length-1]] >= value[nowText]) {
                const o = operatorStack.pop();

                const num2 = numStack.pop();
                const num1 = numStack.pop();

                // 계산
                if(o === '+') {
                    const num = num1 + num2;
                    numStack.push(num);
                }
                else if(o === '-') {
                    num = num1 - num2;
                    numStack.push(num);
                }
                else if(o === '×') {
                    num = num1 * num2;
                    numStack.push(num);
                }
                else if(o === '÷') {
                    num = num1 / num2;
                    numStack.push(num);
                }
                else if(o == '%') {
                    num = num1 % num2;
                    numStack.push(num);
                }
            }
            operatorStack.push(nowText);
        }
        else {
            numStack.push(nowText);
        }
    }
    while(operatorStack.length) {
        const o = operatorStack.pop();
        const num2 = numStack.pop();
        const num1 = numStack.pop();
        if(o === '+') {
            num = num1 + num2;
            numStack.push(num);
        }
        else if(o === '-') {
            num = num1 - num2;
            numStack.push(num);
        }
        else if(o === '×') {
            num = num1 * num2;
            numStack.push(num);
        }
        else if(o == '÷') {
            num = num1 / num2;
            numStack.push(num);
        }
        else if(o == '%') {
            num = num1 % num2;
            numStack.push(num);
        }
    }
    
    display.value = numStack[0];
    return;
}