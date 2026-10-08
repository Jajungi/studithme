(function () {
  "use strict";

  function w(text, id, kind) {
    var token = { t: text };
    if (id) token.id = id;
    if (kind) token.k = kind;
    return token;
  }

  function step(titleKo, titleEn, ko, en, extra) {
    var item = {
      titleKo: titleKo,
      titleEn: titleEn,
      ko: ko,
      en: en,
      name: [],
      idx: [],
      out: []
    };
    if (extra) {
      Object.keys(extra).forEach(function (key) {
        item[key] = extra[key];
      });
    }
    return item;
  }

  function cell(index, value, shade, to) {
    return { i: String(index), v: String(value), shade: shade || "", to: to || "" };
  }

  function lane(name, captionKo, captionEn, rows) {
    return { name: name, captionKo: captionKo, captionEn: captionEn, rows: rows };
  }

  var py = ["P", "y", "t", "h", "o", "n"];

  function wordLane(hot, captionKo, captionEn) {
    var topHot = hot < 0 ? hot + py.length : hot;
    var top = py.map(function (ch, i) {
      var shade = "";
      if (i === topHot) shade = "hot";
      else if (i < topHot) shade = "in";
      return cell(i, ch, shade);
    });
    var bot = py.map(function (ch, i) {
      var neg = i - py.length;
      return cell(neg, ch, neg === hot ? "hot" : "");
    });
    return lane("word", captionKo, captionEn, hot < 0 ? [top, bot] : [top]);
  }

  var WALKS = {
    io: {
      lines: [
        [w("b"), w(" = "), w("2", "n2", "num")],
        [w("print", "pr", "fn"), w("("), w("\"b =\"", "s1", "str"), w(", "), w("float", "fl", "fn"), w("("), w("b", "b1"), w("))")],
        [w("text"), w(" = "), w("input", "inp", "fn"), w("(\"Enter a number: \")", "prompt", "str")],
        [w("n", "nL"), w(" = "), w("int", "intn", "fn"), w("("), w("text", "tx"), w(")")],
        [w("print", "pr2", "fn"), w("("), w("f\"n={n}\"", "fs", "str"), w(")")],
        [w("# print(\"skip\")", "cmt", "cmt")]
      ],
      steps: [
        step("b에 2를 넣는다", "Store 2 in b", "대입 = 은 비교가 아니다. 오른쪽 정수 2를 계산한 뒤 이름 b에 연결한다. 이 줄만으로는 화면에 아무것도 나오지 않는다. 오른쪽 칸에서 b가 2를 가리키는 상태를 본다.", "Assignment = is not a comparison. The integer 2 on the right is evaluated and bound to the name b. This line alone writes nothing to the screen. The lane shows b referring to 2.", { line: 0, name: ["n2"], lane: lane("b", "b는 정수 2다. 출력은 아직 없다.", "b is the integer 2. There is no output yet.", [[cell("b", "2", "hot", "")]]) }),
        step("print가 한 줄을 쓴다", "print writes one line", "안쪽부터 본다. float(b)는 b의 2를 받아 새 실수 2.0을 만든다. print는 문자열 \"b =\"와 그 2.0을 쉼표로 받아, 기본 sep인 공백 하나로 이어 b = 2.0을 한 줄에 쓴다. 호출의 반환값은 None이지만 이 프로그램은 그 값을 저장하지 않는다.", "Read the inside first. float(b) takes b’s 2 and builds a new float 2.0. print receives the string \"b =\" and that 2.0, joins them with the default sep of one space, and writes b = 2.0 on one line. The call returns None, but this program does not store that return value.", { line: 1, name: ["pr", "fl", "b1"], out: ["s1"] }),
        step("input이 한 줄을 받는다", "input reads one line", "안내 문구 Enter a number: 가 뜬 뒤 입력을 기다린다. 이 종합 예에서는 키보드에 4와 Enter를 친 것으로 둔다. 반환값은 글자 \"4\"이며 이름 text에 담긴다. 숫자처럼 보여도 자료형은 str이라서, 아직 4 + 1 같은 정수 연산에 바로 쓰지 않는다.", "The prompt Enter a number: appears, then input waits. In this combined example the typed line is 4 and Enter. The return value is the characters \"4\", stored in text. Even though it looks numeric, its type is str, so it is not yet used in integer arithmetic such as 4 + 1.", { line: 2, name: ["inp"], idx: ["prompt"] }),
        step("int가 정수로 바꾼다", "int builds an integer", "int(text)는 문자열 \"4\"를 읽어 정수 4를 새로 만든다. 그 결과가 n에 대입된다. text 이름은 여전히 문자열 \"4\"를 가리킨다. 변환은 새 값을 만들 뿐, 인자를 제자리에서 바꾸지 않는다. 이제 n으로는 정수 연산을 할 수 있다.", "int(text) reads the string \"4\" and builds the integer 4. That result is assigned to n. The name text still refers to the string \"4\". Conversion creates a new value; it does not change the argument in place. n can now take part in integer arithmetic.", { line: 3, name: ["tx", "nL"], out: ["intn"], lane: lane("n / text", "n은 정수 4, text는 글자 \"4\"로 남는다.", "n is the integer 4; text remains the characters \"4\".", [[cell("n", "4", "hot", ""), cell("text", "\"4\"", "in", "")]]) }),
        step("f-string을 출력한다", "Print the f-string", "f\"n={n}\"에서 중괄호 안의 n을 먼저 계산한다. n이 4이므로 문자열 값은 \"n=4\"가 된다. 그 문자열을 print가 받아 한 줄을 쓴다. f-string 표기만으로는 출력되지 않고, print가 있어야 터미널에 나타난다.", "In f\"n={n}\", the n inside the braces is evaluated first. Because n is 4, the string value is \"n=4\". print receives that string and writes one line. An f-string alone does not print; print is what makes it appear in the terminal.", { line: 4, name: ["fs"], out: ["pr2"] }),
        step("주석은 건너뛴다", "The comment is skipped", "줄이 # 로 시작하므로 그 줄 전체는 실행되지 않는다. print(\"skip\")은 호출되지 않고, 터미널 출력도 늘어나지 않는다. 주석은 결과를 바꾸지 않고 사람을 위한 메모이거나, 잠시 끈 코드다.", "Because the line starts with #, the whole line is not executed. print(\"skip\") is never called, and the terminal output does not grow. A comment does not change results; it is a note for people, or a line kept out of execution for the moment.", { line: 5, idx: ["cmt"] })
      ],
      terms: [
        [],
        ["b = 2.0"],
        ["b = 2.0", ">Enter a number: 4"],
        ["b = 2.0", ">Enter a number: 4"],
        ["b = 2.0", ">Enter a number: 4", "n=4"],
        ["b = 2.0", ">Enter a number: 4", "n=4"]
      ]
    },
    values: {
      lines: [
        [w("n"), w(" = "), w("9", "nine", "num")],
        [w("n", "nL"), w(" = "), w("n", "nR"), w(" - "), w("2", "two", "num")],
        [w("a"), w(" = "), w("b"), w(" = "), w("2", "both", "num")],
        [w("name"), w(", "), w("age"), w(" = "), w("[\"Ada\", \"20\"]", "pair", "str")],
        [w("print", "pr", "fn"), w("("), w("type", "ty", "fn"), w("("), w("n", "nT"), w("))")]
      ],
      steps: [
        step("n은 9", "n is 9", "오른쪽 정수 9를 이름 n에 연결한다. 대입만으로는 출력이 없다. 이후 줄에서 n을 읽으면 이 9부터 시작한다.", "The integer 9 on the right is bound to the name n. Assignment alone produces no output. Later lines that read n start from this 9.", { line: 0, name: ["nine"], lane: lane("n", "n은 정수 9다.", "n is the integer 9.", [[cell("n", "9", "hot", "")]]) }),
        step("n은 7이 된다", "n becomes 7", "오른쪽을 먼저 계산한다. 그때 n은 아직 9이므로 9 - 2는 7이다. 그 7을 다시 왼쪽 n에 연결한다. 예전의 9와의 연결은 끊긴다. 한 줄 안에서 ‘읽기 → 계산 → 다시 담기’ 순서다.", "The right side runs first. At that moment n is still 9, so 9 - 2 is 7. That 7 is bound back to n on the left. The old link to 9 is dropped. In one line the order is read → compute → store again.", { line: 1, name: ["nR", "two"], out: ["nL"], lane: lane("n", "계산 뒤 n은 7이다.", "After the calculation, n is 7.", [[cell("n", "7", "hot", "")]]) }),
        step("a와 b가 같은 2", "a and b share 2", "연쇄 대입이다. 식 2를 한 번만 계산하고, 그 같은 결과를 a와 b에 차례로 연결한다. 지금은 불변 정수라서 두 이름이 같은 값을 가리키는 상태로 보면 된다.", "This is chained assignment. The expression 2 is evaluated once, and that same result is bound to a and then to b. Here it is an immutable integer, so both names refer to that value.", { line: 2, name: ["both"], lane: lane("a, b", "a와 b는 둘 다 2다.", "Both a and b are 2.", [[cell("a", "2", "hot", ""), cell("b", "2", "in", "")]]) }),
        step("두 칸을 두 이름에 넣는다", "Two cells, two names", "언패킹이다. 왼쪽 이름 개수와 오른쪽 칸 개수가 둘로 같다. 위 숫자 0이 첫 칸이다. 가운데 값이 Ada인 칸은 name으로, 값이 \"20\"인 칸은 age로 간다. \"20\"은 따옴표가 있는 글자라서 정수 20이 아니다.", "This is unpacking. There are two names on the left and two cells on the right. Top number 0 is the first cell. The cell whose value is Ada goes to name; the cell whose value is \"20\" goes to age. \"20\" is quoted text, not the integer 20.", { line: 3, name: ["pair"], lane: lane("[\"Ada\", \"20\"]", "위: 칸 번호. 가운데: 값. 아래: 들어가는 이름.", "Top: index. Middle: value. Bottom: destination name.", [[cell("0", "Ada", "hot", "→ name"), cell("1", "\"20\"", "in", "→ age")]]) }),
        step("type이 int를 출력한다", "type prints int", "이 시점의 n은 앞에서 7로 바뀐 상태다. type(n)은 형 int를 반환하고, print가 그 결과를 <class 'int'> 형태로 한 줄에 쓴다. type 호출은 n의 값을 바꾸지 않는다.", "At this point n is still the 7 from earlier. type(n) returns the type int, and print writes that result as <class 'int'> on one line. Calling type does not change the value of n.", { line: 4, name: ["nT"], out: ["ty", "pr"] })
      ],
      terms: [
        [],
        [],
        [],
        [],
        ["<class 'int'>"]
      ]
    },
    convert: {
      lines: [
        [w("print", null, "fn"), w("("), w("int", "i1", "fn"), w("("), w("9.9", "f99", "num"), w("))")],
        [w("print", null, "fn"), w("("), w("int", "i2", "fn"), w("("), w("\"9\"", "s9", "str"), w("))")],
        [w("print", null, "fn"), w("("), w("float", "fl", "fn"), w("("), w("2", "n2", "num"), w("))")],
        [w("print", null, "fn"), w("("), w("\"a = \"", "sa", "str"), w(" + "), w("str", "st", "fn"), w("("), w("1", "one", "num"), w("))")],
        [w("chars"), w(" = "), w("list", "ls", "fn"), w("("), w("\"ab\"", "ab", "str"), w(")")],
        [w("print", "pc", "fn"), w("("), w("chars", "ch"), w(")")],
        [w("pair"), w(" = "), w("tuple", "tu", "fn"), w("("), w("[1, 2]", "lst", "str"), w(")")],
        [w("print", "pp", "fn"), w("("), w("pair", "pr"), w(")")]
      ],
      steps: [
        step("9.9에서 소수점을 버린다", "Drop the fraction of 9.9", "int는 새 정수를 만든다. 실수 9.9를 넣으면 소수점 아래를 버려 9가 된다. 반올림이 아니라 버림이다. print가 그 9를 한 줄에 쓴다.", "int builds a new integer. Given the float 9.9 it drops the fraction and yields 9. That is truncation, not rounding. print writes that 9 on one line.", { line: 0, name: ["f99"], out: ["i1"] }),
        step("글자 9를 정수로 읽는다", "Read the character 9 as an integer", "인자 \"9\"는 문자열이지만 정수 모양이라 int가 정수 9로 읽는다. 점아 있는 \"9.0\"은 이 단계에서 직접 받지 않는다. 그때는 float를 먼저 거친다.", "The argument \"9\" is a string, but it looks like an integer, so int reads it as 9. A dotted \"9.0\" is not accepted at this step; go through float first.", { line: 1, name: ["s9"], out: ["i2"] }),
        step("2를 2.0으로 바꾼다", "Turn 2 into 2.0", "float(2)는 정수 2와 값이 같아 보여도 자료형이 실수인 새 값 2.0을 만든다. print가 2.0을 출력한다.", "float(2) builds a new value 2.0 that looks like 2 but has float type. print writes 2.0.", { line: 2, name: ["n2"], out: ["fl"] }),
        step("수를 글자로 붙인다", "Join a number as text", "문자열과 수를 + 로 이으려면 형이 같아야 한다. str(1)이 글자 \"1\"을 만들고 \"a = \"와 이어져 \"a = 1\"이 된 뒤 print가 그 줄을 쓴다.", "Joining text and a number with + needs matching types. str(1) makes the characters \"1\", which join to \"a = \" as \"a = 1\", and print writes that line.", { line: 3, name: ["one"], out: ["st", "sa"] }),
        step("글자를 칸으로 옮긴다", "Move characters into cells", "list(\"ab\")는 새 리스트를 만든다. 문자열의 글자 하나가 칸 하나다. 0번 칸 a, 1번 칸 b가 chars에 대입된다. 원본 \"ab\" 문자열은 그대로다.", "list(\"ab\") builds a new list. Each character of the string becomes one cell. Cell 0 is a and cell 1 is b, assigned to chars. The original string \"ab\" is unchanged.", { line: 4, name: ["ab"], out: ["ls"], lane: lane("\"ab\" → chars", "위: 칸 번호. 아래: 그 칸의 글자.", "Top: index. Bottom: character in that cell.", [[cell("0", "a", "hot", "chars[0]"), cell("1", "b", "in", "chars[1]")]]) }),
        step("chars를 출력한다", "Print chars", "print가 리스트 표기 ['a', 'b']를 한 줄에 쓴다. 이 출력은 chars가 가리키는 리스트를 보여 줄 뿐, \"ab\"를 바꾸지 않는다.", "print writes the list notation ['a', 'b'] on one line. That display shows the list chars refers to; it does not change \"ab\".", { line: 5, name: ["ch"], out: ["pc"] }),
        step("리스트를 튜플로 고정한다", "Freeze the list into a tuple", "tuple([1, 2])는 칸 값이 같은 새 튜플 (1, 2)를 만든다. 이 튜플의 칸은 나중에 pair[0] = ... 형태의 대입으로 바꾸지 못한다.", "tuple([1, 2]) builds a new tuple (1, 2) with the same cell values. Those cells cannot later be replaced by an assignment such as pair[0] = ....", { line: 6, name: ["lst"], out: ["tu"] }),
        step("pair를 출력한다", "Print pair", "print가 튜플 표기 (1, 2)를 출력한다. 종합 예시의 변환 흐름이 여기서 끝난다.", "print writes the tuple notation (1, 2). The conversion path of this combined example ends here.", { line: 7, name: ["pr"], out: ["pp"] })
      ],
      terms: [
        ["9"],
        ["9", "9"],
        ["9", "9", "2.0"],
        ["9", "9", "2.0", "a = 1"],
        ["9", "9", "2.0", "a = 1"],
        ["9", "9", "2.0", "a = 1", "['a', 'b']"],
        ["9", "9", "2.0", "a = 1", "['a', 'b']"],
        ["9", "9", "2.0", "a = 1", "['a', 'b']", "(1, 2)"]
      ]
    },
    ops: {
      lines: [
        [w("x"), w(" = "), w("9.0", "x0", "num")],
        [w("print", null, "fn"), w("("), w("x", "xd"), w(" / "), w("2", "d2", "num"), w(")")],
        [w("print", null, "fn"), w("("), w("pow", "pw", "fn"), w("("), w("x", "xp"), w(", "), w("3", "p3", "num"), w("))")],
        [w("n"), w(" = "), w("4", "n4", "num")],
        [w("n", "nL"), w(" *= "), w("2 + 3", "rhs", "num")],
        [w("print", null, "fn"), w("("), w("n", "np"), w(")")],
        [w("print", null, "fn"), w("("), w("2 + 3 * 4", "prec"), w(")")],
        [w("print", null, "fn"), w("("), w("True and False", "bo"), w(")")],
        [w("print", null, "fn"), w("("), w("\"Py\"", "py", "str"), w(" in "), w("\"Python\"", "py2", "str"), w(")")]
      ],
      steps: [
        step("x는 9.0", "x is 9.0", "x에 실수 9.0을 넣는다. 출력은 아직 없다.", "The float 9.0 is stored in x. There is no output yet.", { line: 0, name: ["x0"], lane: lane("x", "x는 9.0이다.", "x is 9.0.", [[cell("x", "9.0", "hot", "")]]) }),
        step("9.0 / 2는 4.5", "9.0 / 2 is 4.5", "/ 는 실수 나눗셈이다. print가 4.5를 출력한다. x는 9.0 그대로다.", "/ is real division. print writes 4.5. x is still 9.0.", { line: 1, name: ["xd", "d2"] }),
        step("pow는 거듭제곱", "pow is exponentiation", "pow(x, 3)은 x ** 3과 같다. 9.0을 세 번 곱한 729.0이 출력된다.", "pow(x, 3) is the same as x ** 3. print writes 729.0, 9.0 multiplied by itself three times.", { line: 2, name: ["pw", "xp"], idx: ["p3"] }),
        step("n은 4", "n is 4", "다음 복합 대입에 쓸 4를 n에 넣는다.", "4 is stored in n for the next augmented assignment.", { line: 3, name: ["n4"] }),
        step("오른쪽을 먼저 계산한다", "The right side runs first", "2 + 3이 먼저 5가 된다. n *= 5는 n = n * 5라서 n은 20이 된다.", "2 + 3 becomes 5 first. n *= 5 is n = n * 5, so n becomes 20.", { line: 4, name: ["nL"], idx: ["rhs"], lane: lane("n", "4 * 5 = 20.", "4 * 5 = 20.", [[cell("n", "20", "hot", "")]]) }),
        step("n을 출력한다", "Print n", "print가 20을 출력한다.", "print writes 20.", { line: 5, name: ["np"] }),
        step("곱셈이 덧셈보다 먼저", "Multiplication precedes addition", "3 * 4가 먼저 12가 되고, 2 + 12는 14다. 괄호가 없으면 이 순서다.", "3 * 4 becomes 12 first, then 2 + 12 is 14. Without parentheses, that is the order.", { line: 6, idx: ["prec"] }),
        step("and는 양쪽이 참이어야 한다", "and needs both sides true", "True and False는 False다. 왼쪽이 거짓이면 오른쪽은 계산하지 않는다. 여기는 왼쪽이 참이라 오른쪽 False까지 본다.", "True and False is False. When the left side is false, the right side is not evaluated. Here the left side is true, so the right side, False, is read.", { line: 7, idx: ["bo"] }),
        step("\"Python\" 안에 \"Py\"", "\"Python\" contains \"Py\"", "연속된 \"Py\"가 있으므로 True다.", "The contiguous text \"Py\" is there, so the result is True.", { line: 8, name: ["py2"], idx: ["py"] })
      ],
      terms: [
        [],
        ["4.5"],
        ["4.5", "729.0"],
        ["4.5", "729.0"],
        ["4.5", "729.0"],
        ["4.5", "729.0", "20"],
        ["4.5", "729.0", "20", "14"],
        ["4.5", "729.0", "20", "14", "False"],
        ["4.5", "729.0", "20", "14", "False", "True"]
      ]
    },
    cond: {
      lines: [
        [w("number"), w(" = "), w("5", "five", "num")],
        [w("if ", null, "kw"), w("number < 0", "c1"), w(":")],
        [w("    print", null, "fn"), w("(\"negative\")", "neg", "str")],
        [w("elif ", null, "kw"), w("number == 0", "c2"), w(":")],
        [w("    print", null, "fn"), w("(\"zero\")", "z", "str")],
        [w("elif ", null, "kw"), w("number < 10", "c3"), w(":")],
        [w("    print", "ps", "fn"), w("(\"single\")", "sg", "str")],
        [w("else:", "el", "kw")],
        [w("    print", null, "fn"), w("(\"big\")", "bg", "str")],
        [w("if ", null, "kw"), w("number < 10", "c4"), w(":")],
        [w("    if ", null, "kw"), w("number % 2 == 0", "c5"), w(":")],
        [w("        print", null, "fn"), w("(\"even\")", "ev", "str")],
        [w("    else:", "el2", "kw")],
        [w("        print", "po", "fn"), w("(\"odd\")", "od", "str")]
      ],
      steps: [
        step("number는 5", "number is 5", "이후 조건은 모두 이 5를 본다.", "Every later condition looks at this 5.", { line: 0, name: ["five"], lane: lane("number", "number는 5다.", "number is 5.", [[cell("number", "5", "hot", "")]]) }),
        step("5 < 0은 거짓", "5 < 0 is false", "첫 if의 조건이 거짓이라 print(\"negative\")는 실행하지 않고 다음 elif로 간다.", "The first if is false, so print(\"negative\") does not run and control goes to the next elif.", { line: 1, idx: ["c1"] }),
        step("5 == 0은 거짓", "5 == 0 is false", "이 elif도 거짓이다. zero는 출력되지 않는다.", "This elif is also false. zero is not printed.", { line: 3, idx: ["c2"] }),
        step("5 < 10은 참", "5 < 10 is true", "이 갈래가 참이므로 본문으로 들어간다. 아래 else는 보지 않는다.", "This branch is true, so its body runs. The else below is not tested.", { line: 5, idx: ["c3"] }),
        step("single을 출력한다", "Print single", "print가 single을 출력한다. 같은 if의 else는 실행되지 않는다.", "print writes single. The else of this if does not run.", { line: 6, name: ["ps"], out: ["sg"] }),
        step("바깥 if가 참", "The outer if is true", "5 < 10이 다시 참이라 안쪽 if를 보러 들어간다.", "5 < 10 is true again, so control enters to test the inner if.", { line: 9, idx: ["c4"] }),
        step("5는 짝수가 아니다", "5 is not even", "5 % 2 == 0이 거짓이라 even은 출력하지 않고 안쪽 else로 간다.", "5 % 2 == 0 is false, so even is not printed and control goes to the inner else.", { line: 10, idx: ["c5"] }),
        step("odd를 출력한다", "Print odd", "안쪽 else가 실행되어 odd가 출력된다.", "The inner else runs and odd is printed.", { line: 13, name: ["po"], out: ["od"] })
      ],
      terms: [
        [],
        [],
        [],
        [],
        ["single"],
        ["single"],
        ["single"],
        ["single", "odd"]
      ]
    },
    modules: {
      lines: [
        [w("import ", null, "kw"), w("math", "m"), w(", "), w("random", "r")],
        [w("random.seed", "seed", "fn"), w("("), w("1", "one", "num"), w(")")],
        [w("x"), w(" = "), w("1.0", "xv", "num")],
        [w("print", null, "fn"), w("("), w("round", null, "fn"), w("("), w("math.pi", "pi"), w(", 2))")],
        [w("print", null, "fn"), w("("), w("round", null, "fn"), w("("), w("math.exp", "ex", "fn"), w("(x), 2))")],
        [w("print", null, "fn"), w("("), w("math.log", "lg", "fn"), w("(x))")],
        [w("print", null, "fn"), w("("), w("math.log10", "l10", "fn"), w("(x))")],
        [w("print", null, "fn"), w("("), w("math.sqrt", "sq", "fn"), w("(x))")],
        [w("print", null, "fn"), w("("), w("round", null, "fn"), w("("), w("math.cos", "co", "fn"), w("(x), 2))")],
        [w("print", null, "fn"), w("("), w("round", null, "fn"), w("("), w("math.sin", "si", "fn"), w("(x), 2))")],
        [w("print", null, "fn"), w("("), w("round", null, "fn"), w("("), w("random.random", "rr", "fn"), w("(), 2))")],
        [w("print", null, "fn"), w("("), w("round", null, "fn"), w("("), w("random.uniform", "un", "fn"), w("(1, 10), 2))")],
        [w("print", null, "fn"), w("("), w("random.randrange", "rg1", "fn"), w("(10))")],
        [w("print", null, "fn"), w("("), w("random.randrange", "rg2", "fn"), w("(1, 10))")],
        [w("print", null, "fn"), w("("), w("random.randint", "ri", "fn"), w("(1, 10))")],
        [w("print", null, "fn"), w("("), w("random.choice", "ch", "fn"), w("("), w("\"abc\"", "abc", "str"), w("))")]
      ],
      steps: [
        step("math와 random을 불러온다", "Load math and random", "import는 두 모듈의 이름을 이 프로그램에서 쓸 수 있게 한다.", "import makes both module names available in this program.", { line: 0, name: ["m", "r"] }),
        step("같은 임의 수열로 고정한다", "Fix the random sequence", "random.seed(1) 뒤의 random 호출은 이 프로그램에서 아래 출력과 같다. 시드가 없으면 실행마다 달라진다.", "After random.seed(1), the random calls in this program match the output below. Without a seed, each run can differ.", { line: 1, name: ["seed"], idx: ["one"] }),
        step("x는 1.0", "x is 1.0", "이후 math 함수는 이 1.0을 받는다.", "The later math functions receive this 1.0.", { line: 2, name: ["xv"] }),
        step("원주율", "Pi", "math.pi를 소수 둘째 자리로 반올림하면 3.14다.", "Rounding math.pi to two decimal places yields 3.14.", { line: 3, name: ["pi"] }),
        step("e의 x제곱", "e to the power x", "math.exp(1.0)은 e다. 소수 둘째 자리까지 보이면 2.72다.", "math.exp(1.0) is e. Shown to two decimal places, it is 2.72.", { line: 4, name: ["ex"] }),
        step("자연로그", "Natural log", "math.log(1.0)은 0.0이다.", "math.log(1.0) is 0.0.", { line: 5, name: ["lg"] }),
        step("밑이 10인 로그", "Base-10 log", "math.log10(1.0)도 0.0이다.", "math.log10(1.0) is also 0.0.", { line: 6, name: ["l10"] }),
        step("제곱근", "Square root", "math.sqrt(1.0)은 1.0이다.", "math.sqrt(1.0) is 1.0.", { line: 7, name: ["sq"] }),
        step("코사인", "Cosine", "math.cos(1.0)을 소수 둘째 자리까지 보이면 0.54다. 인자는 라디안이다.", "math.cos(1.0), shown to two decimal places, is 0.54. The argument is in radians.", { line: 8, name: ["co"] }),
        step("사인", "Sine", "math.sin(1.0)을 소수 둘째 자리까지 보이면 0.84다.", "math.sin(1.0), shown to two decimal places, is 0.84.", { line: 9, name: ["si"] }),
        step("0 이상 1 미만", "From 0 up to 1", "random.random()은 그 구간의 실수다. 이 시드에서는 소수 둘째 자리가 0.13이다.", "random.random() is a float in that interval. With this seed, two decimal places show 0.13.", { line: 10, name: ["rr"] }),
        step("1 이상 10 미만의 실수", "A float from 1 up to 10", "random.uniform(1, 10)은 이 시드에서 소수 둘째 자리가 8.63이다.", "With this seed, random.uniform(1, 10) shows 8.63 to two decimal places.", { line: 11, name: ["un"] }),
        step("0 이상 10 미만의 정수", "An integer from 0 up to 10", "random.randrange(10)의 끝 10은 빠진다. 이 시드에서는 1이다.", "The stop 10 of random.randrange(10) is excluded. With this seed the value is 1.", { line: 12, name: ["rg1"] }),
        step("1 이상 10 미만의 정수", "An integer from 1 up to 10", "random.randrange(1, 10)도 끝 값은 빠진다. 이 시드에서는 5다.", "random.randrange(1, 10) also excludes the stop. With this seed the value is 5.", { line: 13, name: ["rg2"] }),
        step("1 이상 10 이하", "From 1 through 10", "random.randint(1, 10)은 끝 값 10을 포함한다. 이 시드에서는 2다.", "random.randint(1, 10) includes the end value 10. With this seed the value is 2.", { line: 14, name: ["ri"] }),
        step("묶음에서 하나", "One element of the sequence", "random.choice(\"abc\")는 a, b, c 중 하나를 고른다. 이 시드에서는 b다.", "random.choice(\"abc\") picks one of a, b, and c. With this seed it is b.", { line: 15, name: ["ch"], idx: ["abc"] })
      ],
      terms: [
        [],
        [],
        [],
        ["3.14"],
        ["3.14", "2.72"],
        ["3.14", "2.72", "0.0"],
        ["3.14", "2.72", "0.0", "0.0"],
        ["3.14", "2.72", "0.0", "0.0", "1.0"],
        ["3.14", "2.72", "0.0", "0.0", "1.0", "0.54"],
        ["3.14", "2.72", "0.0", "0.0", "1.0", "0.54", "0.84"],
        ["3.14", "2.72", "0.0", "0.0", "1.0", "0.54", "0.84", "0.13"],
        ["3.14", "2.72", "0.0", "0.0", "1.0", "0.54", "0.84", "0.13", "8.63"],
        ["3.14", "2.72", "0.0", "0.0", "1.0", "0.54", "0.84", "0.13", "8.63", "1"],
        ["3.14", "2.72", "0.0", "0.0", "1.0", "0.54", "0.84", "0.13", "8.63", "1", "5"],
        ["3.14", "2.72", "0.0", "0.0", "1.0", "0.54", "0.84", "0.13", "8.63", "1", "5", "2"],
        ["3.14", "2.72", "0.0", "0.0", "1.0", "0.54", "0.84", "0.13", "8.63", "1", "5", "2", "b"]
      ]
    },
    loops: {
      lines: [
        [w("stamina"), w(" = "), w("2", "st2", "num")],
        [w("while ", null, "kw"), w("True", "wtru", "kw"), w(":")],
        [w("    stamina", "stL"), w(" -= "), w("1", "one", "num")],
        [w("    if ", null, "kw"), w("not stamina", "nst"), w(":")],
        [w("        break", "br0", "kw")],
        [w("raw"), w(" = "), w("[70, 40, 85, -1, 90]", "raw")],
        [w("kept"), w(" = "), w("[]", "empty")],
        [w("for ", null, "kw"), w("n"), w(" in "), w("raw", "rfor"), w(":")],
        [w("    if ", null, "kw"), w("n < 0", "neg"), w(":")],
        [w("        break", "br1", "kw")],
        [w("    if ", null, "kw"), w("n < 60", "fail"), w(":")],
        [w("        continue", "ct", "kw")],
        [w("    kept.append", "ap", "fn"), w("("), w("n", "nv"), w(")")],
        [w("total"), w(" = "), w("0", "t0", "num")],
        [w("for ", null, "kw"), w("i, n"), w(" in "), w("enumerate", "en", "fn"), w("(kept, start=1):", "ens")],
        [w("    print", "pe", "fn"), w("("), w("i, n", "pair"), w(")")],
        [w("    total", "tL"), w(" += "), w("n", "tn")],
        [w("print", "pt", "fn"), w("("), w("total", "tf"), w(")")],
        [w("k"), w(" = "), w("0", "k0", "num")],
        [w("while ", null, "kw"), w("k < 2", "kc"), w(":")],
        [w("    k", "kL"), w(" = "), w("k + 1", "kadd")],
        [w("else:", "els", "kw")],
        [w("    print", "pk", "fn"), w("("), w("k", "kv"), w(")")],
        [w("for ", null, "kw"), w("row"), w(" in "), w("range(1, 3)", "rr"), w(":")],
        [w("    for ", null, "kw"), w("col"), w(" in "), w("range(1, 3)", "rc"), w(":")],
        [w("        if ", null, "kw"), w("row == col", "eq"), w(":")],
        [w("            continue", "ct2", "kw")],
        [w("        print", "pp", "fn"), w("("), w("row, col", "rcpair"), w(")")],
        [w("for ", null, "kw"), w("n, tag"), w(" in "), w("zip", "zp", "fn"), w("(kept, [\"A\", \"B\", \"C\"]):", "zargs")],
        [w("    print", "pz", "fn"), w("("), w("tag, n", "zn"), w(")")]
      ],
      steps: [
        step("체력 2로 시작한다", "Start with stamina 2", "이어질 while True가 끝내려면 본문에서 체력을 줄이고 break를 쓸 것이다.", "The coming while True will end by lowering stamina in the body and using break.", { line: 0, name: ["st2"], lane: lane("stamina", "시작 체력은 2다.", "Starting stamina is 2.", [[cell("stamina", "2", "hot", "")]]) }),
        step("while True에 들어간다", "Enter while True", "조건 True는 항상 참이라, 끝나는 일은 본문의 break에 맡긴다.", "The condition True is always true, so ending the loop is left to break in the body.", { line: 1, idx: ["wtru"] }),
        step("체력이 1이 된다", "stamina becomes 1", "stamina -= 1로 2에서 1이 된다. 아직 0이 아니다.", "stamina -= 1 changes 2 into 1. It is not yet 0.", { line: 2, name: ["stL"], lane: lane("stamina", "체력은 1이다.", "stamina is 1.", [[cell("stamina", "1", "hot", "")]]) }),
        step("1은 아직 참이다", "1 is still truthy", "if not stamina는 체력이 0일 때만 참이다. 지금은 본문의 break로 가지 않는다.", "if not stamina is true only when stamina is 0. Break is not taken yet.", { line: 3, idx: ["nst"] }),
        step("다시 while True", "Back to while True", "break가 없었으므로 조건을 다시 본다. True라서 본문에 한 번 더 들어간다.", "There was no break, so the condition is tested again. It is True, so the body runs once more.", { line: 1, idx: ["wtru"] }),
        step("체력이 0이 된다", "stamina becomes 0", "한 번 더 줄여 0이 된다. 다음 if가 참이 된다.", "One more decrement makes it 0. The next if becomes true.", { line: 2, name: ["stL"], lane: lane("stamina", "체력은 0이다.", "stamina is 0.", [[cell("stamina", "0", "hot", "")]]) }),
        step("not 0 이라 break 갈래", "not 0, so take break", "0은 거짓이므로 not stamina가 참이다. break로 간다.", "0 is falsy, so not stamina is true. Control goes to break.", { line: 3, idx: ["nst"] }),
        step("break로 while True 종료", "break ends while True", "조건만으로는 끝나지 않던 반복이 break로 끝난다. 프로그램은 다음 줄로 이어진다.", "The loop that could not end by its condition alone ends with break. The program continues on the next line.", { line: 4, out: ["br0"] }),
        step("점수 목록 raw", "Score list raw", "70, 40, 85, -1, 90이다. -1은 끝 신호로 쓸 것이고, 90은 그 뒤에 있어 읽히지 않을 수 있다.", "The cells are 70, 40, 85, -1, and 90. -1 will be the stop signal, and 90 after it may stay unread.", { line: 5, name: ["raw"], lane: lane("raw", "0이 첫 칸이다.", "0 is the first cell.", [[cell("0", "70", "hot", ""), cell("1", "40", "in", ""), cell("2", "85", "in", ""), cell("3", "-1", "in", ""), cell("4", "90", "in", "")]]) }),
        step("kept는 빈 리스트", "kept is an empty list", "60 이상인 점수만 담을 그릇이다. 지금은 칸이 없다.", "This list will hold only scores of 60 or more. It has no cells yet.", { line: 6, name: ["empty"], lane: lane("kept", "아직 비어 있다.", "It is still empty.", [[cell("kept", "[]", "hot", "")]]) }),
        step("n은 70", "n is 70", "첫 칸 70을 n에 넣고 본문으로 들어간다.", "70 from the first cell is bound to n, and the body runs.", { line: 7, name: ["rfor"], lane: lane("n", "이번 점수는 70이다.", "This score is 70.", [[cell("0", "70", "hot", "→ n")]]) }),
        step("70은 음수가 아니다", "70 is not negative", "끝 신호 검사가 거짓이라 break는 실행되지 않는다.", "The stop-signal test is false, so break does not run.", { line: 8, idx: ["neg"] }),
        step("70은 60 이상이다", "70 is at least 60", "낙제 검사 n < 60이 거짓이라 continue도 실행되지 않는다.", "The fail test n < 60 is false, so continue does not run either.", { line: 10, idx: ["fail"] }),
        step("70을 kept에 넣는다", "Append 70 to kept", "kept.append(n) 뒤 kept는 [70]이다.", "After kept.append(n), kept is [70].", { line: 12, name: ["nv"], out: ["ap"], lane: lane("kept", "합격 점수 하나가 들어갔다.", "One passing score is stored.", [[cell("0", "70", "hot", "")]]) }),
        step("n은 40", "n is 40", "다음 칸 40을 n에 넣는다.", "40 from the next cell is bound to n.", { line: 7, name: ["rfor"], lane: lane("n", "이번 점수는 40이다.", "This score is 40.", [[cell("1", "40", "hot", "→ n")]]) }),
        step("40은 음수가 아니다", "40 is not negative", "break 갈래는 건너뛴다.", "The break branch is skipped.", { line: 8, idx: ["neg"] }),
        step("40은 60 미만이라 continue", "40 is below 60, so continue", "continue가 이번 본문의 append를 건너뛴다. kept는 여전히 [70]이다.", "continue skips append for this pass. kept stays [70].", { line: 10, idx: ["fail"], out: ["ct"], lane: lane("kept", "낙제 점수는 담지 않는다.", "A failing score is not stored.", [[cell("0", "70", "in", "")]]) }),
        step("n은 85", "n is 85", "다음 칸 85를 n에 넣는다.", "85 from the next cell is bound to n.", { line: 7, name: ["rfor"], lane: lane("n", "이번 점수는 85다.", "This score is 85.", [[cell("2", "85", "hot", "→ n")]]) }),
        step("85를 kept에 넣는다", "Append 85 to kept", "음수도 아니고 60 이상이므로 append까지 간다. kept는 [70, 85]다.", "It is neither negative nor below 60, so append runs. kept is [70, 85].", { line: 12, name: ["nv"], out: ["ap"], lane: lane("kept", "합격 점수가 두 개다.", "There are two passing scores.", [[cell("0", "70", "in", ""), cell("1", "85", "hot", "")]]) }),
        step("n은 -1", "n is -1", "끝 신호 -1이 n에 들어온다. 뒤의 90은 아직 보지 않았다.", "The stop signal -1 is bound to n. The later 90 has not been seen.", { line: 7, name: ["rfor"], lane: lane("n", "음수 끝 신호다.", "A negative stop signal.", [[cell("3", "-1", "hot", "→ n")]]) }),
        step("음수라 break", "Negative, so break", "n < 0이 참이라 이 for를 즉시 끝낸다. 90은 읽지 않는다.", "n < 0 is true, so this for ends at once. 90 stays unread.", { line: 8, idx: ["neg"], out: ["br1"] }),
        step("합 total은 0", "total starts at 0", "kept에 모은 점수만 더할 준비다.", "Ready to add only the scores gathered in kept.", { line: 13, name: ["t0"] }),
        step("번호 1과 70", "Index 1 and 70", "enumerate(kept, start=1)의 첫 쌍이다. start=1이라 화면 번호가 1부터다.", "This is the first pair from enumerate(kept, start=1). Because start is 1, the display index begins at 1.", { line: 14, name: ["en"], idx: ["ens"], lane: lane("enumerate", "위는 번호, 아래는 점수다.", "Top is the index, bottom is the score.", [[cell("1", "70", "hot", "→ i, n"), cell("2", "85", "in", "→ i, n")]]) }),
        step("1 70을 출력한다", "Print 1 70", "print(i, n)이 1 70을 한 줄로 쓴다.", "print(i, n) writes 1 70 on one line.", { line: 15, name: ["pair"], out: ["pe"] }),
        step("total에 70을 더한다", "Add 70 to total", "합이 0에서 70이 된다.", "The sum changes from 0 to 70.", { line: 16, name: ["tL", "tn"], lane: lane("total", "합은 70이다.", "The sum is 70.", [[cell("total", "70", "hot", "")]]) }),
        step("번호 2와 85", "Index 2 and 85", "다음 쌍은 (2, 85)다.", "The next pair is (2, 85).", { line: 14, name: ["en"] }),
        step("2 85를 출력한다", "Print 2 85", "print가 2 85를 출력한다.", "print writes 2 85.", { line: 15, name: ["pair"], out: ["pe"] }),
        step("total에 85를 더한다", "Add 85 to total", "70 + 85이므로 total은 155다.", "70 + 85 makes total 155.", { line: 16, name: ["tL", "tn"], lane: lane("total", "합은 155다.", "The sum is 155.", [[cell("total", "155", "hot", "")]]) }),
        step("합 155를 출력한다", "Print the sum 155", "enumerate 반복이 칸을 모두 돌아 평범하게 끝난 뒤, 합을 출력한다.", "After enumerate finished every cell normally, the sum is printed.", { line: 17, name: ["tf"], out: ["pt"] }),
        step("k는 0", "k is 0", "while else를 보여 줄 카운터다.", "A counter for the while-else example.", { line: 18, name: ["k0"] }),
        step("0 < 2라서 본문으로", "0 < 2, enter the body", "조건이 참이라 k를 올린다.", "The condition is true, so k will be raised.", { line: 19, idx: ["kc"] }),
        step("k는 1", "k becomes 1", "k + 1을 다시 넣고 조건을 다시 본다.", "k + 1 is stored, then the condition is tested again.", { line: 20, name: ["kL"], lane: lane("k", "k는 1이다.", "k is 1.", [[cell("k", "1", "hot", "")]]) }),
        step("k는 2", "k becomes 2", "1 < 2가 참이라 한 번 더 본문을 실행한다.", "1 < 2 is true, so the body runs once more.", { line: 20, name: ["kL"], lane: lane("k", "k는 2다.", "k is 2.", [[cell("k", "2", "hot", "")]]) }),
        step("2 < 2는 거짓, else로", "2 < 2 is false, go to else", "break 없이 조건이 거짓이 되었으므로 while의 else가 실행된다.", "The condition became false without break, so the while else runs.", { line: 19, idx: ["kc"] }),
        step("else가 2를 출력한다", "else prints 2", "평범하게 끝났다는 표시로 print(k)가 2를 출력한다.", "print(k) writes 2 to mark a normal end.", { line: 22, name: ["kv"], out: ["pk"] }),
        step("바깥 row는 1", "Outer row is 1", "range(1, 3)이라 row는 1 다음에 2다. 끝 3은 빠진다.", "range(1, 3) gives row 1 then 2. Stop 3 is excluded.", { line: 23, name: ["rr"] }),
        step("안쪽 col는 1", "Inner col is 1", "row가 1로 고정된 채 안쪽 range(1, 3)이 시작된다.", "With row fixed at 1, the inner range(1, 3) starts.", { line: 24, name: ["rc"] }),
        step("row와 col가 같아 continue", "row equals col, continue", "1 == 1이라 continue가 출력 줄을 건너뛴다.", "1 == 1, so continue skips the print line.", { line: 25, idx: ["eq"], out: ["ct2"] }),
        step("안쪽 col는 2", "Inner col is 2", "안쪽의 다음 값이다.", "This is the next inner value.", { line: 24, name: ["rc"] }),
        step("1 2를 출력한다", "Print 1 2", "row와 col가 다르므로 print가 1 2를 출력한다.", "row and col differ, so print writes 1 2.", { line: 27, name: ["rcpair"], out: ["pp"] }),
        step("바깥 row는 2", "Outer row is 2", "안쪽이 끝났으므로 바깥이 다음 칸 2로 간다. 안쪽은 다시 1부터다.", "The inner loop finished, so the outer loop moves to 2. The inner loop restarts at 1.", { line: 23, name: ["rr"] }),
        step("2 1을 출력한다", "Print 2 1", "row 2, col 1은 서로 달라 출력된다. 그다음 col 2는 같아서 continue로 건너뛴다.", "row 2 and col 1 differ, so they are printed. The later col 2 matches row and is skipped by continue.", { line: 27, name: ["rcpair"], out: ["pp"] }),
        step("zip으로 점수에 표 붙이기", "Label scores with zip", "kept는 [70, 85]이고 표는 A, B, C다. 짧은 kept 길이만큼만 짝이 생긴다.", "kept is [70, 85] and the tags are A, B, C. Pairs stop at the shorter length, kept.", { line: 28, name: ["zp"], idx: ["zargs"], lane: lane("zip", "짧은 쪽 길이만큼만 짝이다.", "Pairs match the shorter length.", [[cell("0", "70/A", "hot", ""), cell("1", "85/B", "in", ""), cell("2", "C", "out", "no pair")]]) }),
        step("A 70을 출력한다", "Print A 70", "첫 짝 tag=A, n=70이다.", "The first pair is tag=A, n=70.", { line: 29, name: ["zn"], out: ["pz"] }),
        step("B 85를 출력한다", "Print B 85", "둘째 짝을 출력하고, C는 짝이 없어 여기서 프로그램이 끝난다.", "The second pair is printed. C has no partner, so the program ends here.", { line: 29, name: ["zn"], out: ["pz"] })
      ],
      terms: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        ["1 70"],
        ["1 70"],
        ["1 70"],
        ["1 70", "2 85"],
        ["1 70", "2 85"],
        ["1 70", "2 85", "155"],
        ["1 70", "2 85", "155"],
        ["1 70", "2 85", "155"],
        ["1 70", "2 85", "155"],
        ["1 70", "2 85", "155"],
        ["1 70", "2 85", "155"],
        ["1 70", "2 85", "155", "2"],
        ["1 70", "2 85", "155", "2"],
        ["1 70", "2 85", "155", "2"],
        ["1 70", "2 85", "155", "2"],
        ["1 70", "2 85", "155", "2"],
        ["1 70", "2 85", "155", "2", "1 2"],
        ["1 70", "2 85", "155", "2", "1 2"],
        ["1 70", "2 85", "155", "2", "1 2", "2 1"],
        ["1 70", "2 85", "155", "2", "1 2", "2 1"],
        ["1 70", "2 85", "155", "2", "1 2", "2 1", "A 70"],
        ["1 70", "2 85", "155", "2", "1 2", "2 1", "A 70", "B 85"]
      ]
    },
    indexing: {
      lines: [
        [w("word"), w(" = "), w("\"Python\"", "w0", "str")],
        [w("print", null, "fn"), w("("), w("word", "wA"), w("["), w("0", "i0", "num"), w("])")],
        [w("print", null, "fn"), w("("), w("word", "wB"), w("["), w("-1", "i1", "num"), w("])")],
        [w("nums"), w(" = "), w("[10, 20, 30, 40]", "arr")],
        [w("print", null, "fn"), w("("), w("nums", "nA"), w("["), w("3", "i3", "num"), w("])")],
        [w("print", null, "fn"), w("("), w("word", "wC"), w("["), w("1:-1", "sl"), w("])")],
        [w("print", null, "fn"), w("("), w("len", "ln", "fn"), w("("), w("word", "wE"), w("))")]
      ],
      steps: [
        step("word는 \"Python\"", "word is \"Python\"", "여섯 글자를 word에 넣는다. 번호는 0부터 5까지다.", "Six characters are stored in word. The indexes run from 0 through 5.", { line: 0, name: ["w0"], lane: lane("word", "칸은 6개. 마지막 번호는 5다.", "There are 6 cells. The last index is 5.", [[cell("0", "P", "in", ""), cell("1", "y", "", ""), cell("2", "t", "", ""), cell("3", "h", "", ""), cell("4", "o", "", ""), cell("5", "n", "hot", "")]]) }),
        step("0은 첫 칸 P", "0 is the first cell, P", "이름을 찾은 뒤 번호 0을 본다. 0은 첫 칸이고 문자는 P다. print가 P를 출력한다.", "The name is found, then index 0 is read. 0 is the first cell and the character is P. print writes P.", { line: 1, name: ["wA"], idx: ["i0"], lane: lane("word[0]", "0이 첫 칸이다.", "0 is the first cell.", [[cell("0", "P", "hot", ""), cell("1", "y", "in", ""), cell("2", "t", "", ""), cell("3", "h", "", ""), cell("4", "o", "", ""), cell("5", "n", "", "")]]) }),
        step("-1은 마지막 n", "-1 is the last cell, n", "음수는 뒤에서 센다. -1은 n이다. print가 n을 출력한다.", "A negative index counts from the back. -1 is n. print writes n.", { line: 2, name: ["wB"], idx: ["i1"], lane: lane("word[-1]", "앞에서 세면 5번, 뒤에서 세면 -1이다.", "From the front this cell is 5. From the back it is -1.", [[cell("5", "n", "hot", ""), cell("-1", "n", "in", "")]]) }),
        step("nums는 네 칸", "nums has four cells", "10, 20, 30, 40을 nums에 넣는다.", "10, 20, 30, and 40 are stored in nums.", { line: 3, name: ["arr"], lane: lane("nums", "칸이 4개여도 마지막 번호는 3이다.", "Four cells still end at index 3.", [[cell("0", "10", "in", "1번째"), cell("1", "20", "in", "2번째"), cell("2", "30", "in", "3번째"), cell("3", "40", "hot", "4번째")]]) }),
        step("3은 네 번째 칸 40", "3 is the fourth cell, 40", "0, 1, 2 다음이 3이므로 네 번째 칸이다. print가 40을 출력한다.", "3 comes after 0, 1, and 2, so it is the fourth cell. print writes 40.", { line: 4, name: ["nA"], idx: ["i3"] }),
        step("1부터 -1 직전까지", "From 1 up to -1", "시작 1은 포함하고 끝 -1은 빠진다. n 앞에서 멈추므로 ytho가 출력된다.", "Start 1 is included and stop -1 is excluded. The slice stops before n, so ytho is printed.", { line: 5, name: ["wC"], idx: ["sl"], lane: lane("word[1:-1]", "P는 시작 전이라 빠지고, n은 끝이라 빠진다.", "P is before the start. n is the stop, so it is left out.", [[cell("0", "P", "out", ""), cell("1", "y", "hot", ""), cell("2", "t", "in", ""), cell("3", "h", "in", ""), cell("4", "o", "in", ""), cell("-1", "n", "out", "")]]) }),
        step("len은 칸의 개수", "len is the number of cells", "len(word)는 6이다. 마지막 번호는 6이 아니라 5다.", "len(word) is 6. The last index is 5, not 6.", { line: 6, name: ["wE"], out: ["ln"] })
      ],
      terms: [
        [],
        ["P"],
        ["P", "n"],
        ["P", "n"],
        ["P", "n", "40"],
        ["P", "n", "40", "ytho"],
        ["P", "n", "40", "ytho", "6"]
      ]
    },
    strings: {
      lines: [
        [w("s"), w(" = "), w("\"  Python  \"", "raws", "str")],
        [w("s", "sL"), w(" = "), w("s.strip()", "st")],
        [w("print", null, "fn"), w("("), w("s.lower()", "low"), w(")")],
        [w("print", null, "fn"), w("("), w("\"a.b\".replace(\".\", \"\")", "rp"), w(")")],
        [w("print", null, "fn"), w("("), w("\"-\".join(\"AB\")", "jn"), w(")")],
        [w("print", null, "fn"), w("("), w("\"a,b,c\".split(\",\", 1)", "sp"), w(")")],
        [w("print", null, "fn"), w("("), w("\"Pi = {:.2f}\".format(3.14159)", "fm"), w(")")]
      ],
      steps: [
        step("양끝에 공백이 있다", "There are spaces at both ends", "s는 공백, Python, 공백이다. 가운데 글자는 아직 그대로다.", "s is spaces, then Python, then spaces. The letters in the middle are still as written.", { line: 0, name: ["raws"] }),
        step("strip이 끝을 뺀다", "strip removes the ends", "strip은 양쪽 공백을 뺀 새 문자열 Python을 반환한다. 그 결과를 s에 다시 넣어야 이름이 바뀐다. 원래 글의 가운데는 건드리지 않는다.", "strip returns a new string, Python, with the spaces at both ends removed. That result has to be stored back in s. The letters in the middle are untouched.", { line: 1, name: ["st"], out: ["sL"], lane: lane("s", "공백이 빠지고 Python이 남는다.", "The spaces are removed and Python remains.", [[cell("s", "Python", "hot", "")]]) }),
        step("lower가 소문자를 출력한다", "lower prints lowercase", "s.lower()는 python이라는 새 문자열이다. s 자체는 Python으로 남는다. print가 python을 출력한다.", "s.lower() is a new string, python. s itself remains Python. print writes python.", { line: 2, name: ["low"] }),
        step("replace가 점을 지운다", "replace removes the dots", "\".\"를 빈 문자열로 바꾼 새 문자열 ab가 출력된다.", "A new string, ab, is printed, with \".\" replaced by an empty string.", { line: 3, name: ["rp"] }),
        step("join이 사이에 끼운다", "join places the separator between", "구분자는 앞의 \"-\"다. A와 B 사이에 끼워 A-B가 출력된다.", "The separator is the \"-\" in front. It is placed between A and B, and A-B is printed.", { line: 4, name: ["jn"], lane: lane("AB", "글자 사이에 - 를 넣는다.", "A - is placed between the characters.", [[cell("0", "A", "in", ""), cell("1", "B", "hot", "")]]) }),
        step("한 번만 자른다", "Split only once", "maxsplit이 1이라 첫 쉼표에서만 자른다. ['a', 'b,c']가 출력된다.", "maxsplit is 1, so only the first comma is a split. ['a', 'b,c'] is printed.", { line: 5, name: ["sp"] }),
        step("소수 둘째 자리로 맞춘다", "Two digits after the decimal point", "{:.2f}는 소수점 아래 두 자리로 반올림한다. Pi = 3.14가 출력된다.", "{:.2f} rounds to two digits after the decimal point. Pi = 3.14 is printed.", { line: 6, name: ["fm"] })
      ],
      terms: [
        [],
        [],
        ["python"],
        ["python", "ab"],
        ["python", "ab", "A-B"],
        ["python", "ab", "A-B", "['a', 'b,c']"],
        ["python", "ab", "A-B", "['a', 'b,c']", "Pi = 3.14"]
      ]
    },
    funcs: {
      lines: [
        [w("global_variable", "g"), w(" = "), w("\"ccc\"", "ccc", "str")],
        [w("def ", null, "kw"), w("my_function", "fnm"), w("():")],
        [w("    local_variable", "loc"), w(" = "), w("\"abc\"", "abc", "str")],
        [w("    print", "pg", "fn"), w("("), w("global_variable", "gr"), w(")")],
        [w("    return ", null, "kw"), w("local_variable", "ret")],
        [w("print", "pc", "fn"), w("("), w("my_function()", "call"), w(")")]
      ],
      steps: [
        step("전역 이름에 ccc", "The global name holds ccc", "함수 밖에서 만든 global_variable은 전역 이름이다. 값은 ccc다.", "global_variable, created outside the function, is a global name. Its value is ccc.", { line: 0, name: ["g"], idx: ["ccc"], lane: lane("global_variable", "함수 밖에서도 이 이름이 보인다.", "This name is visible outside the function too.", [[cell("global", "ccc", "hot", "")]]) }),
        step("함수를 만들기만 한다", "The function is only created", "def는 my_function이라는 함수를 만든다. 이 줄에서는 본문이 실행되지 않는다.", "def creates the function my_function. The body does not run on this line.", { line: 1, name: ["fnm"] }),
        step("호출이 본문으로 들어간다", "The call enters the body", "print의 인자 my_function()을 계산하려고 함수 본문으로 들어간다.", "Evaluating the argument my_function() enters the function body.", { line: 5, name: ["call"], out: ["pc"] }),
        step("지역 이름 abc", "The local name abc", "함수 안에서 대입한 local_variable은 이 함수의 지역 이름이다. 밖에서는 이 이름이 보이지 않는다.", "local_variable, assigned inside the function, is local to this function. That name is not visible outside.", { line: 2, name: ["loc"], idx: ["abc"], lane: lane("local_variable", "이 이름은 함수가 끝나면 밖에서 읽을 수 없다.", "This name cannot be read outside after the function ends.", [[cell("local", "abc", "hot", "")]]) }),
        step("전역 값을 읽는다", "Read the global value", "함수 안에서 global_variable을 읽기만 하므로 전역 값 ccc가 출력된다.", "The function only reads global_variable, so the global value ccc is printed.", { line: 3, name: ["gr"], out: ["pg"] }),
        step("abc를 돌려준다", "Return abc", "return이 지역 값 abc를 호출한 곳으로 돌려주고 함수를 끝낸다.", "return sends the local value abc back to the caller and ends the function.", { line: 4, name: ["ret"] }),
        step("print가 abc를 출력한다", "print writes abc", "호출 결과가 abc이므로 print가 abc를 출력한다.", "The call's result is abc, so print writes abc.", { line: 5, name: ["call"], out: ["pc"] })
      ],
      terms: [
        [],
        [],
        [],
        [],
        ["ccc"],
        ["ccc"],
        ["ccc", "abc"]
      ]
    },
    lists: {
      lines: [
        [w("box"), w(" = "), w("[10, 20, 30]", "make")],
        [w("box", "b1"), w("["), w("1", "i1", "num"), w("] = "), w("15", "v15", "num")],
        [w("box.append", "ap", "fn"), w("("), w("40", "v40", "num"), w(")")],
        [w("box", "b2"), w(" += "), w("[50]", "ex")],
        [w("box.insert", "ins", "fn"), w("("), w("0, 5", "at"), w(")")],
        [w("box.remove", "rm", "fn"), w("("), w("15", "vrm", "num"), w(")")],
        [w("x", "xL"), w(" = "), w("box.pop()", "pop")],
        [w("other"), w(" = "), w("box.copy()", "cp")],
        [w("box.sort", "so", "fn"), w("("), w("reverse=True", "rev"), w(")")],
        [w("print", "p1", "fn"), w("("), w("box", "bx"), w(")")],
        [w("print", "p2", "fn"), w("("), w("other", "ot"), w(")")]
      ],
      steps: [
        step("box는 세 칸", "box has three cells", "[10, 20, 30]을 box에 넣는다. 번호는 0, 1, 2다.", "[10, 20, 30] is stored in box. The indexes are 0, 1, and 2.", { line: 0, name: ["make"], lane: lane("box", "0이 첫 칸이다.", "0 is the first cell.", [[cell("0", "10", "in", ""), cell("1", "20", "in", ""), cell("2", "30", "hot", "")]]) }),
        step("1번 칸을 15로 바꾼다", "Replace cell 1 with 15", "번호 1은 두 번째 칸이다. 20이 15가 되고 box는 [10, 15, 30]이다.", "Index 1 is the second cell. 20 becomes 15, and box is [10, 15, 30].", { line: 1, name: ["b1"], idx: ["i1"], out: ["v15"], lane: lane("box", "1번 칸만 바뀐다.", "Only cell 1 changes.", [[cell("0", "10", "in", ""), cell("1", "15", "hot", ""), cell("2", "30", "in", "")]]) }),
        step("40을 한 칸으로 붙인다", "Append 40 as one cell", "append는 40을 끝에 한 칸으로 더하고 None을 반환한다. box는 [10, 15, 30, 40]이다.", "append adds 40 as one cell at the end and returns None. box is [10, 15, 30, 40].", { line: 2, name: ["ap"], idx: ["v40"], lane: lane("box", "40이 마지막 칸이다.", "40 is the last cell.", [[cell("0", "10", "", ""), cell("1", "15", "", ""), cell("2", "30", "", ""), cell("3", "40", "hot", "")]]) }),
        step("+= 가 50을 푼다", "+= unpacks 50", "리스트의 += 는 extend와 같이 오른쪽 칸을 하나씩 붙인다. box는 [10, 15, 30, 40, 50]이다.", "On a list, += works like extend and appends each element on the right. box is [10, 15, 30, 40, 50].", { line: 3, name: ["b2"], idx: ["ex"], lane: lane("box", "50이 끝에 붙었다.", "50 was appended at the end.", [[cell("3", "40", "in", ""), cell("4", "50", "hot", "")]]) }),
        step("0번에 5를 끼운다", "Insert 5 at index 0", "insert(0, 5)는 첫 칸 앞에 5를 넣고 뒤를 민다. 반환은 None이다.", "insert(0, 5) places 5 in front of the first cell and shifts the rest. The return value is None.", { line: 4, name: ["ins"], idx: ["at"], lane: lane("box", "5가 새 0번이다.", "5 is the new cell 0.", [[cell("0", "5", "hot", ""), cell("1", "10", "in", "")]]) }),
        step("값 15를 지운다", "Delete the value 15", "remove(15)는 번호가 아니라 값이 15인 첫 칸을 지운다. 반환은 None이다.", "remove(15) deletes the first cell whose value is 15, not a chosen index. The return value is None.", { line: 5, name: ["rm"], idx: ["vrm"] }),
        step("pop이 마지막 50을 뺀다", "pop removes the last 50", "인자가 없는 pop()은 마지막 칸을 빼서 그 값을 반환한다. x는 50이고 box는 [5, 10, 30, 40]이다.", "pop() with no argument removes the last cell and returns that value. x is 50, and box is [5, 10, 30, 40].", { line: 6, name: ["pop"], out: ["xL"], lane: lane("x, box", "뺀 값은 x로 가고, box에서는 빠진다.", "The removed value goes to x and leaves box.", [[cell("x", "50", "hot", ""), cell("box", "[5, 10, 30, 40]", "in", "")]]) }),
        step("copy는 바깥만 새로 만든다", "copy builds a new outer list", "other는 box와 다른 리스트다. 지금 칸의 값은 같다. 이후 box를 정렬해도 other는 이 순서를 유지한다.", "other is a different list from box. The cell values match right now. Sorting box later leaves other in this order.", { line: 7, name: ["cp"], lane: lane("other", "사본은 [5, 10, 30, 40]이다.", "The copy is [5, 10, 30, 40].", [[cell("0", "5", "in", ""), cell("1", "10", "", ""), cell("2", "30", "", ""), cell("3", "40", "hot", "")]]) }),
        step("내림차순으로 정렬한다", "Sort descending", "sort(reverse=True)는 box를 그 자리에서 큰 수부터 정렬하고 None을 반환한다. box는 [40, 30, 10, 5]다.", "sort(reverse=True) sorts box in place from the largest number and returns None. box is [40, 30, 10, 5].", { line: 8, name: ["so"], idx: ["rev"], lane: lane("box", "큰 수부터 정렬됐다.", "The larger numbers come first.", [[cell("0", "40", "hot", ""), cell("1", "30", "in", ""), cell("2", "10", "", ""), cell("3", "5", "", "")]]) }),
        step("정렬된 box를 출력한다", "Print the sorted box", "print가 [40, 30, 10, 5]를 출력한다.", "print writes [40, 30, 10, 5].", { line: 9, name: ["bx"], out: ["p1"] }),
        step("사본은 정렬 전 순서", "The copy keeps the earlier order", "other는 정렬 전의 [5, 10, 30, 40]이다. print가 그 리스트를 출력한다.", "other is still [5, 10, 30, 40] from before the sort. print writes that list.", { line: 10, name: ["ot"], out: ["p2"] })
      ],
      terms: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        ["[40, 30, 10, 5]"],
        ["[40, 30, 10, 5]", "[5, 10, 30, 40]"]
      ]
    },
    tuples: {
      lines: [
        [w("one"), w(" = "), w("(10,)", "onev")],
        [w("plain"), w(" = "), w("(10)", "plainv", "num")],
        [w("print", null, "fn"), w("("), w("one", "o1"), w(")")],
        [w("print", null, "fn"), w("("), w("plain", "p1"), w(")")],
        [w("a"), w(", "), w("*b"), w(" = "), w("[1, 2, 3, 4]", "src")],
        [w("print", null, "fn"), w("("), w("a", "a1"), w(")")],
        [w("print", null, "fn"), w("("), w("b", "b1"), w(")")]
      ],
      steps: [
        step("쉼표가 있어야 튜플", "The comma makes the tuple", "(10,)는 값이 하나인 튜플이다. 쉼표가 튜플을 만든다.", "(10,) is a one-element tuple. The comma is what makes it a tuple.", { line: 0, name: ["onev"], lane: lane("one", "칸이 하나인 튜플이다.", "A tuple with one cell.", [[cell("0", "10", "hot", "")]]) }),
        step("괄호만 있으면 정수", "Parentheses alone are an integer", "(10)은 10을 괄호로 묶은 정수다. plain은 튜플이 아니다.", "(10) is the integer 10 wrapped in parentheses. plain is not a tuple.", { line: 1, name: ["plainv"], lane: lane("plain", "plain은 정수 10이다.", "plain is the integer 10.", [[cell("plain", "10", "hot", "")]]) }),
        step("(10,)를 출력한다", "Print (10,)", "print가 (10,)를 출력한다.", "print writes (10,).", { line: 2, name: ["o1"] }),
        step("10을 출력한다", "Print 10", "print가 정수 10을 출력한다.", "print writes the integer 10.", { line: 3, name: ["p1"] }),
        step("*b가 나머지를 모은다", "*b gathers the rest", "1은 a가 되고, 남은 2, 3, 4는 리스트 b가 된다.", "1 becomes a, and the remaining 2, 3, and 4 become the list b.", { line: 4, name: ["src"], lane: lane("[1, 2, 3, 4]", "*가 붙은 이름은 리스트다.", "The starred name is a list.", [[cell("0", "1", "hot", "→ a"), cell("1", "2", "in", "→ b"), cell("2", "3", "in", "→ b"), cell("3", "4", "in", "→ b")]]) }),
        step("a는 1", "a is 1", "print가 1을 출력한다.", "print writes 1.", { line: 5, name: ["a1"] }),
        step("b는 나머지 리스트", "b is the rest as a list", "print가 [2, 3, 4]를 출력한다.", "print writes [2, 3, 4].", { line: 6, name: ["b1"] })
      ],
      terms: [
        [],
        [],
        ["(10,)"],
        ["(10,)", "10"],
        ["(10,)", "10"],
        ["(10,)", "10", "1"],
        ["(10,)", "10", "1", "[2, 3, 4]"]
      ]
    },
    dicts: {
      lines: [
        [w("menu"), w(" = "), w("{\"Burger\": 5500}", "m0")],
        [w("menu", "m1"), w("["), w("\"Pizza\"", "pz", "str"), w("] = "), w("8500", "price", "num")],
        [w("print", null, "fn"), w("("), w("menu", "m2"), w("["), w("\"Burger\"", "bg", "str"), w("])")],
        [w("del ", null, "kw"), w("menu", "m3"), w("["), w("\"Burger\"", "bg2", "str"), w("]")],
        [w("print", null, "fn"), w("("), w("menu.get", "gt", "fn"), w("(\"Burger\", 0)", "miss"), w(")")],
        [w("blank"), w(" = "), w("dict.fromkeys", "fk", "fn"), w("([\"a\"], 0)", "keys")],
        [w("blank.clear()", "cl")],
        [w("print", null, "fn"), w("("), w("blank", "bl"), w(")")]
      ],
      steps: [
        step("Burger는 5500", "Burger is 5500", "키 Burger와 값 5500으로 menu를 만든다.", "menu is created with key Burger and value 5500.", { line: 0, name: ["m0"], lane: lane("menu", "위는 키, 아래는 값이다.", "The top is the key and the bottom is the value.", [[cell("Burger", "5500", "hot", "")]]) }),
        step("Pizza 키를 추가한다", "Add the Pizza key", "없는 키에 대입하면 그 키가 생긴다. menu는 Burger와 Pizza를 가진다.", "Assigning to a missing key creates it. menu now holds Burger and Pizza.", { line: 1, name: ["m1"], idx: ["pz"], out: ["price"], lane: lane("menu", "Pizza가 이번 대입으로 추가된다.", "Pizza is added by this assignment.", [[cell("Burger", "5500", "in", ""), cell("Pizza", "8500", "hot", "")]]) }),
        step("Burger의 값을 출력한다", "Print Burger's value", "대괄호 안은 키가 된다. print가 5500을 출력한다.", "The brackets hold a key. print writes 5500.", { line: 2, name: ["m2"], idx: ["bg"] }),
        step("Burger를 지운다", "Delete Burger", "del은 Burger 키와 그 값을 지운다. 지운 값은 반환되지 않는다.", "del removes the Burger key and its value. The removed value is not returned.", { line: 3, name: ["m3"], idx: ["bg2"], lane: lane("menu", "Pizza만 남는다.", "Only Pizza remains.", [[cell("Pizza", "8500", "hot", "")]]) }),
        step("없는 키는 0", "A missing key is 0", "Burger는 이미 없다. get(\"Burger\", 0)은 KeyError 대신 기본값 0을 반환한다. menu는 바뀌지 않는다.", "Burger is already gone. get(\"Burger\", 0) returns the default 0 instead of raising KeyError. menu is unchanged.", { line: 4, name: ["gt"], idx: ["miss"] }),
        step("fromkeys가 a를 0으로", "fromkeys sets a to 0", "dict.fromkeys([\"a\"], 0)은 키 a와 값 0인 새 딕셔너리를 만든다.", "dict.fromkeys([\"a\"], 0) builds a new dictionary with key a and value 0.", { line: 5, name: ["fk"], idx: ["keys"], lane: lane("blank", "묶음의 원소가 키가 된다.", "Each element of the iterable becomes a key.", [[cell("a", "0", "hot", "")]]) }),
        step("clear가 비운다", "clear empties it", "clear는 blank의 키를 모두 지우고 None을 반환한다.", "clear deletes every key in blank and returns None.", { line: 6, name: ["cl"], lane: lane("blank", "칸이 없다.", "There are no cells.", [[cell("blank", "{}", "hot", "")]]) }),
        step("빈 딕셔너리를 출력한다", "Print the empty dictionary", "print가 {}를 출력한다.", "print writes {}.", { line: 7, name: ["bl"] })
      ],
      terms: [
        [],
        [],
        ["5500"],
        ["5500"],
        ["5500", "0"],
        ["5500", "0"],
        ["5500", "0"],
        ["5500", "0", "{}"]
      ]
    },
    sets: {
      lines: [
        [w("s"), w(" = "), w("{1, 2, 2}", "lit")],
        [w("t"), w(" = "), w("{2, 3}", "t0")],
        [w("print", null, "fn"), w("("), w("1 in s", "inn"), w(")")],
        [w("print", null, "fn"), w("("), w("sorted", null, "fn"), w("("), w("s & t", "inter"), w("))")],
        [w("print", null, "fn"), w("("), w("sorted", null, "fn"), w("("), w("s | t", "union"), w("))")],
        [w("u"), w(" = "), w("s.copy()", "cp")],
        [w("u.add", "ad", "fn"), w("("), w("9", "nine", "num"), w(")")],
        [w("u.discard", "dc", "fn"), w("("), w("9", "nine2", "num"), w(")")],
        [w("print", null, "fn"), w("("), w("u == {1, 2}", "eq"), w(")")]
      ],
      steps: [
        step("중복된 2는 한 번", "The repeated 2 is kept once", "{1, 2, 2}는 집합 {1, 2}가 된다. 빈 집합은 set()이고, {}는 빈 딕셔너리다.", "{1, 2, 2} becomes the set {1, 2}. An empty set is set(), and {} is an empty dictionary.", { line: 0, name: ["lit"], lane: lane("s", "같은 값은 한 칸만 남는다.", "An equal value is kept in only one cell.", [[cell("s", "1", "in", ""), cell("s", "2", "hot", "")]]) }),
        step("t는 {2, 3}", "t is {2, 3}", "비교에 쓸 집합 t를 만든다.", "t is created for the comparisons that follow.", { line: 1, name: ["t0"] }),
        step("1은 s에 있다", "1 is in s", "in은 원소가 있는지를 본다. print가 True를 출력한다.", "in asks whether the element is present. print writes True.", { line: 2, idx: ["inn"] }),
        step("교집합은 2", "The intersection is 2", "s & t는 양쪽에 있는 원소만 모은 새 집합이다. sorted로 보이면 [2]다. s와 t는 그대로다.", "s & t is a new set of the elements on both sides. Shown with sorted, it is [2]. s and t stay as they were.", { line: 3, idx: ["inter"] }),
        step("합집합은 1, 2, 3", "The union is 1, 2, 3", "s | t는 어느 한쪽에라도 있는 원소의 새 집합이다. 출력은 [1, 2, 3]이다.", "s | t is a new set of the elements on either side. The output is [1, 2, 3].", { line: 4, idx: ["union"] }),
        step("u는 s의 사본", "u is a copy of s", "copy는 새 집합을 반환한다. u와 s는 다른 객체다.", "copy returns a new set. u and s are different objects.", { line: 5, name: ["cp"] }),
        step("9를 더한다", "Add 9", "add(9)는 u에만 9를 넣는다. s는 {1, 2} 그대로다.", "add(9) inserts 9 into u only. s remains {1, 2}.", { line: 6, name: ["ad"], idx: ["nine"], lane: lane("u", "9는 u에만 있다.", "9 is only in u.", [[cell("u", "1", "in", ""), cell("u", "2", "in", ""), cell("u", "9", "hot", "")]]) }),
        step("없는 9가 아니므로 지운다", "9 is present, so it is removed", "discard(9)는 9를 지운다. 없었더라도 오류는 나지 않는다. u는 다시 {1, 2}다.", "discard(9) removes 9. A missing element would not raise an error. u is {1, 2} again.", { line: 7, name: ["dc"], idx: ["nine2"] }),
        step("u와 {1, 2}는 같다", "u equals {1, 2}", "== 는 같은 원소를 가졌는지 본다. print가 True를 출력한다.", "== asks whether the elements are the same. print writes True.", { line: 8, idx: ["eq"] })
      ],
      terms: [
        [],
        [],
        ["True"],
        ["True", "[2]"],
        ["True", "[2]", "[1, 2, 3]"],
        ["True", "[2]", "[1, 2, 3]"],
        ["True", "[2]", "[1, 2, 3]"],
        ["True", "[2]", "[1, 2, 3]"],
        ["True", "[2]", "[1, 2, 3]", "True"]
      ]
    },
    copy: {
      lines: [
        [w("a"), w(" = "), w("[[1], 2]", "a0")],
        [w("b"), w(" = "), w("a", "a1")],
        [w("c"), w(" = "), w("a.copy()", "cp")],
        [w("b.append", "ap", "fn"), w("("), w("3", "three", "num"), w(")")],
        [w("c", "c0"), w("["), w("0", "i0", "num"), w("]["), w("0", "i00", "num"), w("] = "), w("9", "nine", "num")],
        [w("import ", null, "kw"), w("copy", "mod")],
        [w("d"), w(" = "), w("copy.deepcopy", "dp", "fn"), w("("), w("a", "a2"), w(")")],
        [w("d", "d0"), w("[0][0] = "), w("0", "zero", "num")],
        [w("print", null, "fn"), w("("), w("a is b", "isb"), w(")")],
        [w("print", null, "fn"), w("("), w("a", "aprt"), w(")")],
        [w("print", null, "fn"), w("("), w("c", "cprt"), w(")")],
        [w("print", null, "fn"), w("("), w("d", "dprt"), w(")")]
      ],
      steps: [
        step("a는 [[1], 2]", "a is [[1], 2]", "바깥 리스트 안에 리스트 [1]과 수 2가 있다.", "The outer list holds the list [1] and the number 2.", { line: 0, name: ["a0"], lane: lane("a", "0번 칸이 리스트 [1]이다.", "Cell 0 is the list [1].", [[cell("0", "[1]", "hot", ""), cell("1", "2", "in", "")]]) }),
        step("b는 a와 같은 객체", "b is the same object as a", "대입은 리스트를 복사하지 않는다. b와 a는 같은 리스트를 가리킨다.", "Assignment does not copy the list. b and a refer to the same list.", { line: 1, name: ["a1"], lane: lane("a, b", "두 이름이 한 리스트를 가리킨다.", "Two names refer to one list.", [[cell("a", "[[1], 2]", "hot", ""), cell("b", "같은 객체", "in", "")]]) }),
        step("c는 바깥만 새 리스트", "c is a new outer list", "copy는 바깥 리스트만 새로 만든다. 0번 칸의 [1]은 a와 c가 함께 가리킨다.", "copy builds only a new outer list. Cell 0, [1], is still referred to by both a and c.", { line: 2, name: ["cp"], lane: lane("c", "바깥은 새 리스트, 안쪽 [1]은 공유다.", "The outer list is new. The inner [1] is shared.", [[cell("0", "[1] 공유", "hot", ""), cell("1", "2", "in", "")]]) }),
        step("append는 a와 b에만 보인다", "append is visible through a and b", "b.append(3)은 a와 b가 가리키는 그 리스트에 3을 붙인다. c의 바깥 칸 수는 그대로다. a는 [[1], 2, 3]이다.", "b.append(3) adds 3 to the list that a and b refer to. The number of outer cells in c stays the same. a is [[1], 2, 3].", { line: 3, name: ["ap"], idx: ["three"], lane: lane("a", "3은 a의 바깥에만 붙었다.", "3 was appended only on a's outer list.", [[cell("0", "[1]", "in", ""), cell("1", "2", "in", ""), cell("2", "3", "hot", "")]]) }),
        step("안쪽 리스트는 공유된다", "The inner list is shared", "c[0][0] = 9는 공유된 [1]의 0번을 9로 바꾼다. a의 0번도 [9]가 된다. a는 [[9], 2, 3]이고 c는 [[9], 2]다.", "c[0][0] = 9 changes cell 0 of the shared [1] to 9. Cell 0 of a becomes [9] too. a is [[9], 2, 3] and c is [[9], 2].", { line: 4, name: ["c0"], idx: ["i0", "i00"], out: ["nine"], lane: lane("안쪽", "a[0]과 c[0]은 같은 리스트다.", "a[0] and c[0] are the same list.", [[cell("a[0]", "[9]", "hot", ""), cell("c[0]", "[9]", "in", "")]]) }),
        step("copy 모듈을 불러온다", "Load the copy module", "깊은 복사 함수 deepcopy는 copy 모듈에 있다.", "The deep-copy function deepcopy lives in the copy module.", { line: 5, name: ["mod"] }),
        step("안쪽까지 새로 만든다", "The inside is built anew", "deepcopy는 바깥과 안쪽 리스트를 모두 새로 만든다. d는 [[9], 2, 3]이고 a[0]과 d[0]은 다른 리스트다.", "deepcopy builds both the outer list and the inner list anew. d is [[9], 2, 3], and a[0] and d[0] are different lists.", { line: 6, name: ["dp", "a2"] }),
        step("d만 0으로 바뀐다", "Only d becomes 0", "d[0][0] = 0은 d의 안쪽 리스트만 고친다. a는 [[9], 2, 3]으로 남는다.", "d[0][0] = 0 edits only the inner list of d. a remains [[9], 2, 3].", { line: 7, name: ["d0"], idx: ["zero"], lane: lane("d", "d의 안쪽은 a와 다른 리스트다.", "The inside of d is a different list from a.", [[cell("d[0]", "[0]", "hot", ""), cell("a[0]", "[9]", "in", "")]]) }),
        step("a is b는 True", "a is b is True", "a와 b는 같은 객체이므로 True가 출력된다.", "a and b are the same object, so True is printed.", { line: 8, idx: ["isb"] }),
        step("a를 출력한다", "Print a", "a는 [[9], 2, 3]이다. 안쪽 9는 c와 공유된 수정이고, 3은 b를 통한 append다.", "a is [[9], 2, 3]. The inner 9 is the edit shared with c, and 3 is the append made through b.", { line: 9, name: ["aprt"] }),
        step("c를 출력한다", "Print c", "c는 [[9], 2]다. append한 3은 c의 바깥에 없다.", "c is [[9], 2]. The appended 3 is not on c's outer list.", { line: 10, name: ["cprt"] }),
        step("d를 출력한다", "Print d", "d는 [[0], 2, 3]이다. 0으로 바꾼 것은 d의 안쪽뿐이다.", "d is [[0], 2, 3]. The change to 0 is only inside d.", { line: 11, name: ["dprt"] })
      ],
      terms: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        ["True"],
        ["True", "[[9], 2, 3]"],
        ["True", "[[9], 2, 3]", "[[9], 2]"],
        ["True", "[[9], 2, 3]", "[[9], 2]", "[[0], 2, 3]"]
      ]
    }
  };

  var titles = {
    io: ["개념 모아 해보기", "Try the concepts together"],
    values: ["개념 모아 해보기", "Try the concepts together"],
    convert: ["개념 모아 해보기", "Try the concepts together"],
    ops: ["통합 코드", "Combined code"],
    cond: ["통합 코드", "Combined code"],
    modules: ["통합 코드", "Combined code"],
    loops: ["개념 모아 해보기", "Try the concepts together"],
    indexing: ["통합 코드", "Combined code"],
    strings: ["통합 코드", "Combined code"],
    funcs: ["통합 코드", "Combined code"],
    lists: ["통합 코드", "Combined code"],
    tuples: ["통합 코드", "Combined code"],
    dicts: ["통합 코드", "Combined code"],
    sets: ["통합 코드", "Combined code"],
    copy: ["통합 코드", "Combined code"]
  };

  function lang() {
    return document.documentElement.lang === "en" ? "en" : "ko";
  }

  function textOf(item, koKey, enKey) {
    return lang() === "en" ? item[enKey] : item[koKey];
  }

  function paint(root, walk, index) {
    var item = walk.steps[index];
    Array.prototype.forEach.call(root.querySelectorAll(".hl"), function (mark) {
      mark.classList.remove("is-name", "is-idx", "is-out");
    });
    Array.prototype.forEach.call(root.querySelectorAll(".line"), function (line) {
      line.classList.remove("is-line");
    });
    function markIds(ids, cls) {
      (ids || []).forEach(function (id) {
        var node = root.querySelector('.hl[data-id="' + id + '"]');
        if (node) node.classList.add(cls);
      });
    }
    markIds(item.name, "is-name");
    markIds(item.idx, "is-idx");
    markIds(item.out, "is-out");
    if (typeof item.line === "number") {
      var line = root.querySelector('.line[data-line="' + item.line + '"]');
      if (line) line.classList.add("is-line");
    }
    var laneBox = root.querySelector(".lane-box");
    laneBox.innerHTML = "";
    if (item.lane) {
      var box = document.createElement("div");
      box.className = "lane";
      var name = document.createElement("p");
      name.className = "lane-name";
      name.textContent = item.lane.name;
      box.appendChild(name);
      var key = document.createElement("p");
      key.className = "lane-key";
      var numeric = item.lane.rows.some(function (row) {
        return row.some(function (piece) {
          return /^-?\d+$/.test(piece.i);
        });
      });
      var hasTo = item.lane.rows.some(function (row) {
        return row.some(function (piece) {
          return piece.to;
        });
      });
      if (lang() === "en") {
        key.textContent = numeric
          ? (hasTo ? "Top number: index, starting at 0. Middle: the value in that cell. Bottom: where that value goes." : "Top number: index, starting at 0. Bottom: the value in that cell.")
          : "Top: the key. Bottom: that key's value.";
      } else {
        key.textContent = numeric
          ? (hasTo ? "위 숫자: 칸 번호. 0이 첫 칸이다. 가운데: 그 칸의 값. 아래: 그 값이 들어가는 곳." : "위 숫자: 칸 번호. 0이 첫 칸이다. 아래: 그 칸의 값.")
          : "위: 키. 아래: 그 키의 값.";
      }
      box.appendChild(key);
      item.lane.rows.forEach(function (row) {
        var rowEl = document.createElement("div");
        rowEl.className = "lane-row";
        row.forEach(function (piece) {
          var cellEl = document.createElement("div");
          cellEl.className = "cell" + (piece.shade ? " is-" + piece.shade : "");
          var indexEl = document.createElement("span");
          indexEl.className = "cell-i";
          indexEl.textContent = piece.i;
          var valueEl = document.createElement("span");
          valueEl.className = "cell-v";
          valueEl.textContent = piece.v;
          cellEl.appendChild(indexEl);
          cellEl.appendChild(valueEl);
          if (piece.to) {
            var toEl = document.createElement("span");
            toEl.className = "cell-to";
            toEl.textContent = piece.to;
            cellEl.appendChild(toEl);
          }
          rowEl.appendChild(cellEl);
        });
        box.appendChild(rowEl);
      });
      laneBox.appendChild(box);
    }
    root.querySelector(".step-title").textContent = textOf(item, "titleKo", "titleEn");
    root.querySelector(".step-note").textContent = textOf(item, "ko", "en");
    root.querySelector(".walk-count").textContent = (index + 1) + " / " + walk.steps.length;
    root.querySelector(".prev").disabled = index === 0;
    root.querySelector(".next").disabled = index === walk.steps.length - 1;
    var termBody = root.querySelector(".walk-term-body");
    termBody.textContent = "";
    var rows = (walk.terms && walk.terms[index]) || [];
    if (!rows.length) {
      var empty = document.createElement("p");
      empty.className = "term-empty";
      empty.textContent = lang() === "en" ? "no output" : "출력 없음";
      termBody.appendChild(empty);
    } else {
      rows.forEach(function (row) {
        var line = document.createElement("div");
        var text = row;
        var kind = "out";
        if (row.charAt(0) === ">") {
          kind = "in";
          text = row.slice(1);
        } else if (row.charAt(0) === "=") {
          kind = "echo";
          text = row.slice(1);
        }
        line.className = "term-line term-" + kind;
        line.textContent = text;
        termBody.appendChild(line);
      });
    }
  }

  function build(mount, key) {
    var walk = WALKS[key];
    if (!walk) return;
    var current = 0;
    var root = document.createElement("section");
    root.className = "walk";
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "walk-toggle";
    toggle.setAttribute("aria-expanded", "false");
    var body = document.createElement("div");
    body.className = "walk-body";
    body.hidden = true;
    var pre = document.createElement("pre");
    pre.className = "walk-code";
    var code = document.createElement("code");
    walk.lines.forEach(function (line, lineIndex) {
      var lineEl = document.createElement("span");
      lineEl.className = "line";
      lineEl.setAttribute("data-line", String(lineIndex));
      line.forEach(function (token) {
        var span = document.createElement("span");
        span.textContent = token.t;
        if (token.k) span.className = "tok-" + token.k;
        if (token.id) {
          span.className = (span.className ? span.className + " " : "") + "hl";
          span.setAttribute("data-id", token.id);
        }
        lineEl.appendChild(span);
      });
      code.appendChild(lineEl);
    });
    pre.appendChild(code);
    var laneBox = document.createElement("div");
    laneBox.className = "lane-box";
    var stepTitle = document.createElement("p");
    stepTitle.className = "step-title";
    var stepNote = document.createElement("p");
    stepNote.className = "step-note";
    var nav = document.createElement("div");
    nav.className = "walk-nav";
    var prev = document.createElement("button");
    prev.type = "button";
    prev.className = "prev";
    var count = document.createElement("span");
    count.className = "walk-count";
    var next = document.createElement("button");
    next.type = "button";
    next.className = "next";
    var termToggle = document.createElement("button");
    termToggle.type = "button";
    termToggle.className = "term-toggle";
    termToggle.setAttribute("aria-expanded", "false");
    var term = document.createElement("aside");
    term.className = "walk-term";
    var termBar = document.createElement("div");
    termBar.className = "term-bar";
    var termLabel = document.createElement("span");
    termLabel.className = "term-label";
    var termClose = document.createElement("button");
    termClose.type = "button";
    termClose.className = "term-close";
    var termBody = document.createElement("div");
    termBody.className = "walk-term-body";
    termBar.appendChild(termLabel);
    termBar.appendChild(termClose);
    term.appendChild(termBar);
    term.appendChild(termBody);
    function setTerm(open) {
      root.classList.toggle("is-term", open);
      termToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    termToggle.addEventListener("click", function () {
      setTerm(!root.classList.contains("is-term"));
    });
    termClose.addEventListener("click", function () {
      setTerm(false);
    });
    prev.addEventListener("click", function () {
      if (current > 0) {
        current -= 1;
        paint(root, walk, current);
      }
    });
    next.addEventListener("click", function () {
      if (current < walk.steps.length - 1) {
        current += 1;
        paint(root, walk, current);
      }
    });
    nav.appendChild(prev);
    nav.appendChild(count);
    nav.appendChild(next);
    nav.appendChild(termToggle);
    var stage = document.createElement("div");
    stage.className = "walk-stage";
    stage.appendChild(pre);
    stage.appendChild(nav);
    stage.appendChild(term);
    body.appendChild(stage);
    body.appendChild(laneBox);
    body.appendChild(stepTitle);
    body.appendChild(stepNote);
    toggle.addEventListener("click", function () {
      var open = body.hidden;
      body.hidden = !open;
      root.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    root.appendChild(toggle);
    root.appendChild(body);
    mount.appendChild(root);

    function relabel() {
      var ko = lang() !== "en";
      toggle.textContent = ko ? titles[key][0] : titles[key][1];
      prev.textContent = "▲";
      next.textContent = "▼";
      prev.setAttribute("aria-label", ko ? "이전" : "Previous");
      next.setAttribute("aria-label", ko ? "다음" : "Next");
      termToggle.textContent = ko ? "결과" : "Out";
      termLabel.textContent = ko ? "출력" : "Output";
      termClose.textContent = ko ? "닫기" : "Close";
      paint(root, walk, current);
    }
    relabel();
    root._relabel = relabel;
  }

  Array.prototype.forEach.call(document.querySelectorAll(".walk-mount"), function (mount) {
    build(mount, mount.getAttribute("data-walk"));
  });

  var langButton = document.getElementById("lang-toggle");
  if (langButton) {
    langButton.addEventListener("click", function () {
      Array.prototype.forEach.call(document.querySelectorAll(".walk"), function (root) {
        if (root._relabel) root._relabel();
      });
    });
  }
})();
