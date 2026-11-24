# -*- coding: utf-8 -*-
"""Build Programming-9 (exceptions) and Programming-10 (files) chapters into index.html."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "index.html"


def entry(
    eid: str,
    title: str,
    kind_ko: str,
    kind_en: str,
    keys: str,
    behavior_ko: str,
    behavior_en: str,
    sig: str,
    usage_ko: str,
    usage_en: str,
    notes_ko: str,
    notes_en: str,
    examples: list[tuple[str, str, str]],
) -> str:
    ex_parts = []
    for code, ko, en in examples:
        ex_parts.append(f"<pre><code>{code}</code></pre>\n<p class=\"ko\">{ko}</p>\n<p class=\"en\">{en}</p>")
    examples_html = "\n".join(ex_parts)
    return f'''<article class="entry" id="{eid}" data-exam="final" data-keys="{keys}">
<header class="entry-head"><h3><code>{title}</code> <span class="exam-tag"><span class="ko">기말</span><span class="en">Final</span></span></h3><p class="kind"><span class="ko">{kind_ko}</span><span class="en">{kind_en}</span></p></header>
<section class="block"><h4><span class="ko">특징</span><span class="en">Behavior</span></h4>
<p class="ko">{behavior_ko}</p>
<p class="en">{behavior_en}</p>
</section>
<section class="block"><h4><span class="ko">사용</span><span class="en">Usage</span></h4>
<p class="sig"><code>{sig}</code></p>
<p class="ko">{usage_ko}</p>
<p class="en">{usage_en}</p>
</section>
<section class="block"><h4><span class="ko">보충</span><span class="en">Notes</span></h4>
<p class="ko">{notes_ko}</p>
<p class="en">{notes_en}</p>
</section>
<section class="block"><h4><span class="ko">예시</span><span class="en">Example</span></h4>
{examples_html}
</section>
</article>'''


EXCEPTIONS = [
    entry(
        "exception",
        "예외",
        "개념",
        "concept",
        "exception 예외 Error SyntaxError ZeroDivisionError ValueError",
        "예외(exception)는 프로그램 실행 중에 생기는 비정상 상황이다. 잘못된 입력, 0으로 나누기, 숫자로 바꿀 수 없는 문자열, 없는 파일 열기처럼 예상 밖 값이 오면 파이썬이 예외 객체를 만들고 그 지점에서 실행을 멈춘다. SyntaxError는 코드를 실행하기 전에 문법 자체가 틀린 경우라 실행 중 예외와 구분한다.",
        "An exception is an abnormal situation during execution. Bad input, division by zero, a non-numeric string, or opening a missing file makes Python create an exception object and stop at that point. SyntaxError is a parse-time problem, separate from run-time exceptions.",
        "ZeroDivisionError / ValueError / FileNotFoundError / …",
        "이름만으로 어떤 종류의 문제인지 알 수 있다. 시험에서는 “언제 발생하는지”와 “잡으면 프로그램이 계속 가는지”를 같이 묻는다.",
        "The name tells the kind of problem. Exams ask when it arises and whether catching it lets the program continue.",
        "예외를 잡지 않으면 프로그램이 바로 종료되고 추적(traceback)이 출력된다. “에러가 났다”와 “예외를 처리했다”는 다르다—처리하면 같은 입력에서도 안전하게 메시지를 내고 이어갈 수 있다.",
        "Uncaught exceptions end the program with a traceback. “An error happened” is not the same as “the exception was handled”—handling can print a message and continue.",
        [
            (
                'print(15 / 0)\n# ZeroDivisionError: division by zero',
                "0으로 나누면 ZeroDivisionError가 나고, 잡지 않으면 여기서 끝난다.",
                "Division by zero raises ZeroDivisionError and stops unless caught.",
            ),
            (
                'int("I am inevitable..")\n# ValueError: invalid literal for int() with base 10',
                "숫자로 바꿀 수 없는 문자열은 ValueError다. 수업 슬라이드의 입력 예와 같다.",
                "A non-numeric string raises ValueError—the lecture’s input example.",
            ),
        ],
    ),
    entry(
        "try-except",
        "try / except",
        "문",
        "statement",
        "try except ZeroDivisionError ValueError 예외처리",
        "try 블록은 오류가 날 수 있는 코드를 실행한다. 오류가 나면 파이썬이 예외를 발생(raise)시키고, 맞는 except 블록이 그 예외를 잡아(catch) 처리한다. 잡은 뒤에는 프로그램이 그 지점 이후로 계속 간다.",
        "A try block runs code that might fail. On failure Python raises an exception; a matching except block catches it and handles it. After a catch, execution continues past that structure.",
        "try:\n    …\nexcept SomeError:\n    …",
        "try 뒤에는 적어도 하나의 except가 있어야 한다(try…finally만 쓰는 경우는 예외). 구체적인 예외 이름을 적으면 그 종류만 잡는다.",
        "try needs at least one except (unless it is try…finally alone). Naming a concrete exception catches only that kind.",
        "ZeroDivisionError만 잡으면 문자열 입력의 ValueError는 그대로 발생한다. 수업처럼 0과 잘못된 문자를 모두 막으려면 except를 여러 개 두거나 묶는다.",
        "Catching only ZeroDivisionError still crashes on a ValueError from bad text. Cover both with separate except blocks or a grouped except.",
        [
            (
                'try:\n    i = 0\n    print(f"15 / {i} = {15 / i}")\nexcept ZeroDivisionError:\n    print("Oops! You can\'t divide by zero")\n# Oops! You can\'t divide by zero',
                "0으로 나누려다 ZeroDivisionError가 나고 except가 메시지를 출력한다. 프로그램은 종료되지 않는다.",
                "Division by zero is caught; the message prints and the program does not exit.",
            ),
            (
                'try:\n    i = int("bad")\n    print(15 / i)\nexcept ZeroDivisionError:\n    print("zero")\nexcept ValueError:\n    print("Please enter a valid number !!!")\n# Please enter a valid number !!!',
                "int 변환 실패는 ValueError. 두 번째 except가 잡는다.",
                "Failed int conversion is ValueError; the second except handles it.",
            ),
        ],
    ),
    entry(
        "multi-except",
        "except (A, B)",
        "문",
        "statement",
        "multi except tuple ZeroDivisionError ValueError parentheses",
        "여러 예외를 같은 처리로 묶을 때는 except 뒤에 튜플로 적는다. 괄호가 필수다. while True와 함께 쓰면 올바른 입력이 올 때까지 다시 물을 수 있다.",
        "Group several exceptions with the same handler in a tuple after except. Parentheses are required. With while True you can re-prompt until input is valid.",
        "except (ZeroDivisionError, ValueError):\n    …",
        "튜플 안의 어느 예외든 같은 블록으로 간다. 성공하면 break로 루프를 빠져나온다.",
        "Any exception in the tuple enters the same block. On success, break leaves the loop.",
        "괄호 없이 except ZeroDivisionError, ValueError: 형태는 파이썬 3에서 문법 오류다. 반드시 (A, B)로 묶는다.",
        "Without parentheses, except A, B: is a syntax error in Python 3. Always write (A, B).",
        [
            (
                'while True:\n    try:\n        i = int("3")\n        print(f"15 / {i} = {15 / i}")\n        break\n    except (ZeroDivisionError, ValueError):\n        print("Invalid input. Please try again.")\n# 15 / 3 = 5.0',
                "유효한 정수면 나눗셈을 출력하고 break. 잘못된 입력이면 같은 메시지로 다시 시도한다.",
                "Valid int prints the quotient and breaks; bad input retries with the same message.",
            ),
            (
                'try:\n    print(15 / 0)\nexcept (ZeroDivisionError, ValueError):\n    print("Invalid input. Please try again.")\n# Invalid input. Please try again.',
                "0과 ValueError를 한 블록에서 처리하는 수업 패턴이다.",
                "The lecture pattern: one block for both zero and ValueError.",
            ),
        ],
    ),
    entry(
        "except-as",
        "except … as",
        "문",
        "statement",
        "except as err exception object 변수",
        "except 예외 as 이름 은 잡은 예외 객체를 변수에 담는다. print(err)로 어떤 종류의 오류인지 시스템 메시지를 볼 수 있다. as 이름은 선택이다.",
        "except Exc as name binds the exception object. print(err) shows the system message for that error. The as name is optional.",
        "except (ZeroDivisionError, ValueError) as err:\n    print(err)",
        "처리 블록 안에서만 err를 쓴다. 바깥으로 나가면 그 이름은 보통 지워진다(파이썬 버전에 따라 정리).",
        "Use err only inside the handler. Outside, that name is normally cleared.",
        "as는 별칭 import의 as와 문법이 비슷하지만 대상이 모듈이 아니라 예외 객체다. 예외를 다시 raise하지 않으면 프로그램은 계속 간다.",
        "as looks like import aliases, but the target is an exception object, not a module. Without re-raising, the program continues.",
        [
            (
                'try:\n    print(15 / 0)\nexcept ZeroDivisionError as err:\n    print("An exception occurred:", err)\n# An exception occurred: division by zero',
                "err에 ZeroDivisionError 객체가 들어가 메시지가 출력된다.",
                "err holds the ZeroDivisionError; its message is printed.",
            ),
            (
                'while True:\n    try:\n        i = int("2")\n        print(15 / i)\n        break\n    except (ZeroDivisionError, ValueError) as err:\n        print("An exception occurred:", err)\n        print("Please try again.")\n# 7.5',
                "수업 슬라이드처럼 루프·묶음 except·as err를 한자리에 둔 형태다.",
                "Lecture form: loop, grouped except, and as err together.",
            ),
        ],
    ),
    entry(
        "try-else-finally",
        "try / else / finally",
        "문",
        "statement",
        "try else finally 예외 흐름 cleanup",
        "else는 예외가 없을 때만 실행된다. finally는 예외 여부와 관계없이 항상 마지막에 실행되어 정리(cleanup)에 쓴다. 흐름은 정상: try→else→finally, 처리된 예외: try→except→finally, 못 잡은 예외: try→finally 후 오류 메시지.",
        "else runs only when no exception occurred. finally always runs last for cleanup. Flows: success try→else→finally; handled try→except→finally; unhandled try→finally then the error.",
        "try:\n    …\nexcept E:\n    …\nelse:\n    …\nfinally:\n    …",
        "else는 모든 except 뒤에, finally는 맨 뒤에 둔다. 둘 다 선택이다. try…finally만으로 except 없이 쓸 수도 있다.",
        "else follows every except; finally is last. Both are optional. try…finally can omit except.",
        "else에 “성공했을 때만 할 일”을 두고, 파일 닫기·자원 해제는 finally에 둔다. except 안에서 return해도 finally는 먼저 실행된다.",
        "Put success-only work in else; close files in finally. even a return inside except still runs finally first.",
        [
            (
                'try:\n    x = 15 / 3\nexcept ZeroDivisionError:\n    print("zero")\nelse:\n    print("ok", x)\nfinally:\n    print("done")\n# ok 5.0\n# done',
                "예외가 없으면 else와 finally가 순서대로 실행된다.",
                "With no exception, else then finally run.",
            ),
            (
                'try:\n    x = 15 / 0\nexcept ZeroDivisionError:\n    print("zero")\nelse:\n    print("ok")\nfinally:\n    print("done")\n# zero\n# done',
                "예외가 있으면 else는 건너뛰고 finally만 남는다.",
                "On a caught exception, else is skipped; finally still runs.",
            ),
        ],
    ),
]


FILES = [
    entry(
        "file-persist",
        "파일 · 지속성",
        "개념",
        "concept",
        "file persistence 파일 지속성 storage",
        "파일은 프로그램이 읽고 쓸 수 있는 정보의 묶음이다. 디스크 등 저장 장치에 두면 프로그램이 끝나도 데이터가 남는다. 이 성질을 지속성(persistence)이라 한다. 파일 처리(file processing)는 그 파일이나 안의 데이터를 다루는 일이다.",
        "A file holds information a program can read and write. On durable storage the data remain after the program ends—persistence. File processing means working with that file or its data.",
        "open → process → close",
        "프로그램을 다시 실행해도 같은 파일을 열어 이전 결과를 이어 쓸 수 있다. 메모리 변수만으로는 실행이 끝나면 사라진다.",
        "Reopening the same file keeps earlier results across runs. Variables in memory alone disappear when the process ends.",
        "파일은 여러 프로그램이 공유할 수 있다. 쓰는 동안 닫지 않으면 다른 쪽이 잠기거나 내용이 덜 저장될 수 있다.",
        "Files can be shared across programs. Leaving a write handle open can lock others or lose data.",
        [
            (
                '# memory: gone after the program ends\nscore = 100\n# file: still there for the next run\n# open("score.txt", "w").write("100")',
                "변수 score는 실행이 끝나면 없고, 파일에 쓴 값은 다음 실행에서도 읽을 수 있다.",
                "score vanishes after exit; a written file can be read next run.",
            ),
            (
                '# three steps (lecture)\n# 1) open  2) read/write  3) close',
                "수업이 강조하는 세 단계: 열기·처리·닫기.",
                "Lecture’s three steps: open, process, close.",
            ),
        ],
    ),
    entry(
        "file-types",
        "텍스트 · 마크업 · 바이너리",
        "개념",
        "concept",
        "text markup binary utf-8 html xml md jpg",
        "텍스트는 사람이 읽고 편집하기 쉽다. 숫자는 파싱이 필요할 수 있다. 마크업(HTML·XML·Markdown)은 태그로 구조를 드러내 파일이 더 길어질 수 있다. 바이너리(jpg·mp3·exe 등)는 0과 1로 저장되어 사람에게는 읽기 어렵지만 기계에는 효율적이다.",
        "Text is human-readable; numbers may need parsing. Markup (HTML, XML, Markdown) adds structure with tags and tends to be larger. Binary (jpg, mp3, exe, …) stores 0/1 efficiently for machines, not for reading by eye.",
        "text · markup · binary",
        "수업 범위의 파일 입출력 예는 주로 텍스트 모드다. 바이너리는 mode에 b를 붙인다.",
        "Course examples are mostly text mode. Binary uses b in the mode.",
        "마크업도 본질적으로 텍스트다. 바이너리 모드에서는 encoding을 지정하지 않는다.",
        "Markup is still text underneath. Do not set encoding in binary mode.",
        [
            (
                '# text\n# Hello, World!\n# markup HTML\n# &lt;h1&gt;Hello&lt;/h1&gt;\n# binary: .jpg / .mp3 / .exe',
                "세 형식을 이름만으로 구분한다. 시험에서는 “사람이 읽는가 / 태그인가 / 0·1인가”를 묻는다.",
                "Tell the three kinds apart by role: human text, tagged markup, or raw binary.",
            ),
            (
                'open("a.txt", "rt")   # text (default)\nopen("a.bin", "rb")  # binary',
                "t는 기본이라 생략 가능하다. b는 명시한다.",
                "t is the default; b must be stated.",
            ),
        ],
    ),
    entry(
        "open",
        "open",
        "function",
        "function",
        "open mode r w x a t b + FileNotFoundError OSError",
        "open(경로, mode=…, encoding=…)는 지정한 파일에 연결된 파일 객체를 반환한다. 열 수 없으면 OSError(또는 FileNotFoundError)가 난다. mode는 읽기·쓰기·추가 방법을 정한다.",
        "open(path, mode=…, encoding=…) returns a file object for that path. Failure raises OSError (e.g. FileNotFoundError). mode chooses read, write, or append.",
        "open(file, mode='r', encoding='utf-8')",
        "경로는 절대·상대 모두 가능하다. mode를 생략하면 텍스트 읽기('rt')다.",
        "Paths may be absolute or relative. Omitting mode means text read ('rt').",
        "'w'는 기존 내용을 지운다. 'x'는 파일이 이미 있으면 오류. 'a'는 끝에 이어 쓴다. '+'는 읽기·쓰기 겸용. 'b'는 바이너리.",
        "'w' truncates existing data. 'x' errors if the file exists. 'a' appends. '+' allows read and write. 'b' is binary.",
        [
            (
                'f = open("note.txt", mode="w", encoding="utf-8")\nf.write("hi")\nf.close()',
                "쓰기 모드로 열어 문자열을 쓰고 닫는다.",
                "Open for write, write a string, then close.",
            ),
            (
                "# modes (lecture)\n# 'r' read  'w' write(truncate)  'x' exclusive create\n# 'a' append  't' text  'b' binary  '+' update",
                "모드 표는 시험에 그대로 나온다. w와 a의 차이를 먼저 고정한다.",
                "Learn the mode table; fix w vs a first.",
            ),
        ],
    ),
    entry(
        "encoding",
        "encoding",
        "매개변수",
        "parameter",
        "encoding utf-8 cp949 unicode 한글",
        "encoding은 텍스트 모드에서만 쓴다. 읽을 때 바이트→문자, 쓸 때 문자→바이트 변환 규칙을 정한다. 생략하면 OS 기본값을 쓴다. 한글·다국어는 utf-8을 권장한다.",
        "encoding applies in text mode only. It decodes bytes to str on read and encodes on write. If omitted, the OS default is used. Prefer utf-8 for Korean and mixed text.",
        "open(..., encoding='utf-8')",
        "Windows 기본이 cp949인 환경이 많다. macOS는 보통 utf-8. 영어만이면 우연히 통할 수 있어도 한글은 utf-8로 통일한다.",
        "Windows often defaults to cp949; macOS usually utf-8. English-only files may “work,” but Korean should use utf-8.",
        "바이너리 모드('b')에서는 encoding을 넣지 않는다. 잘못 맞추면 한글이 깨지거나 UnicodeDecodeError가 난다.",
        "Do not pass encoding in binary mode. A wrong encoding garbles Korean or raises UnicodeDecodeError.",
        [
            (
                'f = open("ko.txt", "w", encoding="utf-8")\nf.write("안녕")\nf.close()\nf = open("ko.txt", "r", encoding="utf-8")\nprint(f.read())\nf.close()\n# 안녕',
                "같은 utf-8로 쓰고 읽으면 한글이 그대로 나온다.",
                "Matching utf-8 on write and read keeps Korean intact.",
            ),
            (
                "# recommend utf-8 for Korean (lecture)",
                "수업 권장: 한글·한영 혼용은 utf-8.",
                "Lecture: use utf-8 for Korean or mixed text.",
            ),
        ],
    ),
    entry(
        "file-attrs",
        "파일 객체 속성",
        "속성",
        "attribute",
        "name mode encoding closed file object",
        "파일 객체는 상태에 대한 속성을 가진다. name은 파일 이름, mode는 연 모드, encoding은 텍스트 인코딩, closed는 닫혔으면 True다.",
        "A file object exposes state: name, mode, encoding, and closed (True after close).",
        "f.name · f.mode · f.encoding · f.closed",
        "속성은 메서드 호출이 아니라 값이다. closed로 아직 열려 있는지 확인할 수 있다.",
        "These are values, not method calls. closed tells whether the handle is still open.",
        "닫은 뒤에 다시 read/write하면 오류다. closed가 True인지 먼저 본다.",
        "read/write after close fails—check closed first.",
        [
            (
                'f = open("a.txt", "w", encoding="utf-8")\nprint(f.name, f.mode, f.encoding, f.closed)\nf.close()\nprint(f.closed)\n# a.txt w utf-8 False\n# True',
                "닫기 전 closed는 False, 닫은 뒤 True.",
                "closed is False before close and True after.",
            ),
            (
                'f = open("a.txt", "r", encoding="utf-8")\nprint(f.mode)\nf.close()\n# r',
                "mode 속성은 open에 넘긴 접근 방식을 그대로 보여 준다.",
                "mode echoes the access mode passed to open.",
            ),
        ],
    ),
    entry(
        "close",
        "close",
        "method",
        "method",
        "close write flush 닫기",
        "close()는 파일과의 연결을 끊는다. 쓰기 모드에서는 반드시 닫아 내용이 디스크에 반영되게 한다. 읽기만 했을 때도 같은 파일을 다시 열려면 닫고 다시 open하는 것이 안전하다.",
        "close() disconnects from the file. After writing you must close so data are saved. Even after reading, close before reopening the same file in the same program.",
        "f.close()",
        "닫지 않으면 다른 프로그램이 파일을 못 쓰거나, 일부가 저장되지 않을 수 있다.",
        "Without close, others may be locked out or some data may never be saved.",
        "with 문을 쓰면 블록을 나올 때 자동으로 close된다. 수동 close와 이중으로 닫아도 보통 안전하다.",
        "with closes automatically on leaving the block. Closing twice is usually harmless.",
        [
            (
                'f = open("out.txt", "w", encoding="utf-8")\nf.write("saved")\nf.close()',
                "쓰기 후 close가 수업의 기본 습관이다.",
                "Write then close—the lecture’s default habit.",
            ),
            (
                'f = open("out.txt", "r", encoding="utf-8")\nprint(f.read())\nf.close()\n# saved',
                "읽기가 끝나도 close로 연결을 정리한다.",
                "Close after reading to release the connection.",
            ),
        ],
    ),
    entry(
        "write",
        "write",
        "method",
        "method",
        "write append str bytes newline",
        "write(객체)는 파일에 데이터를 쓴다. 텍스트 모드에서는 인자가 str이어야 하고, 자동으로 줄바꿈(\\n)을 붙이지 않는다. 반환값은 쓴 문자(또는 바이트) 수다. 바이너리 모드에서는 bytes가 필요하다.",
        "write(obj) writes data. In text mode obj must be str; no newline is added automatically. It returns the count of characters (or bytes). Binary mode needs bytes.",
        "f.write(s)",
        "줄마다 쓰려면 직접 '\\n'을 붙인다. 숫자는 str(n)으로 바꾼 뒤 쓴다. mode='a'면 기존 내용 끝에 이어 쓴다.",
        "Add '\\n' yourself for line breaks. Convert numbers with str(n). mode='a' appends at the end.",
        "write의 반환값을 변수에 넣어 출력과 혼동하지 않는다. print와 달리 화면에 보이지 않고 파일로만 간다.",
        "Do not confuse write’s return count with printed output—write goes to the file, not the screen.",
        [
            (
                'f = open("a.txt", "w", encoding="utf-8")\nn = f.write("hello")\nf.close()\nprint(n)\n# 5',
                "쓴 문자 수 5가 반환된다. 파일에는 hello만 있고 줄바꿈은 없다.",
                "Returns 5; the file holds hello with no newline.",
            ),
            (
                'f = open("a.txt", "a", encoding="utf-8")\nf.write("\\nworld")\nf.close()',
                "append 모드로 끝에 이어 붙인다.",
                "Append mode adds at the end.",
            ),
        ],
    ),
    entry(
        "write-list",
        "리스트 쓰기",
        "패턴",
        "pattern",
        "write list for str newline utf-8",
        "리스트의 각 원소를 한 줄씩 파일에 넣을 때는 for로 write를 반복한다. 원소가 숫자면 str로 바꾼다. 줄바꿈은 직접 붙인다.",
        "To save list items one per line, loop and write. Convert numbers with str. Add newlines yourself.",
        "for item in L:\n    f.write(item + '\\n')",
        "수업 예: 단어 리스트와 숫자 리스트. encoding='utf-8'을 같이 둔다.",
        "Lecture examples: a word list and a number list, both with encoding='utf-8'.",
        "for-else의 else에서 close하는 예도 슬라이드에 있다. with를 쓰면 close를 직접 쓰지 않아도 된다.",
        "One slide closes in for-else. with avoids a manual close.",
        [
            (
                'L = ["to", "be", "or", "not", "to", "be"]\nf = open("list.txt", mode="w", encoding="utf-8")\nfor word in L:\n    f.write(word + "\\n")\nf.close()',
                "각 단어를 한 줄로 저장한다.",
                "Each word is stored on its own line.",
            ),
            (
                'numbers = [10, 20, 30, 40]\nf = open("numbers.txt", mode="w", encoding="utf-8")\nfor n in numbers:\n    f.write(str(n) + "\\n")\nf.close()',
                "숫자는 str(n) 후에 write한다. int를 그대로 넘기면 TypeError다.",
                "Numbers need str(n); raw int raises TypeError.",
            ),
        ],
    ),
    entry(
        "read",
        "read",
        "method",
        "method",
        "read size EOF cursor 파일읽기",
        "read()는 현재 커서부터 파일 내용을 문자열 하나로 읽는다. size를 주면 그 글자 수만큼만 읽고 커서를 앞으로 옮긴다. size를 생략하거나 음수면 EOF까지 읽는다. EOF 다음에 다시 read하면 빈 문자열 ''이다.",
        "read() returns one string from the cursor. With size it reads that many characters and advances the cursor. Omitting size (or a negative size) reads to EOF. After EOF, read returns ''.",
        "f.read() · f.read(size)",
        "큰 파일은 한 번에 전부 읽으면 메모리를 많이 쓴다. 줄 단위가 필요하면 for line in f 또는 readline을 쓴다.",
        "read() on a huge file uses a lot of memory. Prefer for line in f or readline for line-wise work.",
        "텍스트 모드 기본 예는 encoding='utf-8'과 함께 연 뒤 read하고 close한다.",
        "Typical text example: open with utf-8, read, then close.",
        [
            (
                'f = open("BE101.txt", mode="r", encoding="utf-8")\ncontent = f.read()\nprint(content)\nf.close()',
                "전체 내용을 한 문자열로 읽어 출력한다.",
                "Reads the whole file as one string and prints it.",
            ),
            (
                'f = open("a.txt", "r", encoding="utf-8")\nprint(repr(f.read(2)))\nprint(repr(f.read()))\nf.close()',
                "먼저 2글자, 이어서 나머지. 커서 이동을 보여 준다.",
                "First two characters, then the rest—shows the cursor moving.",
            ),
        ],
    ),
    entry(
        "readline",
        "readline",
        "method",
        "method",
        "readline line newline EOF",
        "readline()은 한 줄을 문자열로 읽는다. 줄 끝의 \\n을 포함한다(마지막 줄은 없을 수 있다). 호출할 때마다 다음 줄로 커서가 이동하고, EOF면 ''를 반환한다.",
        "readline() returns one line as a string, keeping the trailing \\n (except possibly the last line). Each call advances to the next line; at EOF it returns ''.",
        "f.readline() · f.readline(size)",
        "size를 주면 한 줄 안에서도 그 길이까지만 읽는다.",
        "With size, it may stop before the full line.",
        "줄바꿈을 제거하려면 strip() 또는 rstrip('\\n')을 쓴다. for line in f 가 같은 한 줄씩 읽기 패턴이다.",
        "Use strip() or rstrip('\\n') to drop the newline. for line in f is the same line-wise pattern.",
        [
            (
                'f = open("poem.txt", "r", encoding="utf-8")\nprint(repr(f.readline()))\nprint(repr(f.readline()))\nf.close()',
                "두 번 호출하면 첫 줄·둘째 줄이 순서대로 나온다.",
                "Two calls yield the first and second lines in order.",
            ),
            (
                'f = open("poem.txt", "r", encoding="utf-8")\nline = f.readline()\nwhile line:\n    print(line.strip())\n    line = f.readline()\nf.close()',
                "빈 문자열이 나올 때까지 한 줄씩 처리하는 루프다.",
                "Loop until readline returns the empty string.",
            ),
        ],
    ),
    entry(
        "with-open",
        "with open",
        "문",
        "statement",
        "with open context manager close 자동",
        "with open(...) as f: 는 컨텍스트 관리자다. 블록에 들어갈 때 파일을 열고, 블록을 정상·예외로 나가든 자동으로 close한다. 수업에서도 줄 단위 읽기와 함께 소개한다.",
        "with open(...) as f: is a context manager. It opens on entry and always closes on exit—normal or exceptional. The lecture shows it with line-wise reading.",
        "with open(path, mode, encoding=...) as f:\n    …",
        "블록 안에서만 f를 쓴다. 블록 밖에서는 이미 닫힌 상태다.",
        "Use f only inside the block; outside it is already closed.",
        "직접 close를 잊기 쉬운 패턴을 with가 줄여 준다. try/finally로 닫는 것과 같은 목적이다.",
        "with reduces forgotten close calls—same goal as try/finally cleanup.",
        [
            (
                'with open("BE101.txt", mode="r", encoding="utf-8") as f:\n    for line in f:\n        print(line.strip())',
                "한 줄씩 읽으며 strip으로 줄바꿈을 제거한다. 블록 끝에서 자동 close.",
                "Line-wise read with strip; auto-close at the end of the block.",
            ),
            (
                'with open("out.txt", "w", encoding="utf-8") as f:\n    f.write("ok\\n")',
                "쓰기에도 with를 쓰면 close를 따로 호출하지 않는다.",
                "with for writing also skips a manual close.",
            ),
        ],
    ),
    entry(
        "readlines",
        "readlines",
        "method",
        "method",
        "readlines list hint memory for append",
        "readlines()는 파일 전체를 줄 리스트로 반환한다. 각 원소는 한 줄 문자열(보통 끝 \\n 포함)이다. hint로 대략 읽을 문자 양을 제한할 수 있다. 커서가 이미 EOF면 []다.",
        "readlines() returns a list of line strings (usually keeping \\n). hint can limit how much is read. At EOF it returns [].",
        "f.readlines() · f.readlines(hint)",
        "작은·중간 파일에 짧고 편하다. 큰 파일은 메모리 부담이 커서 for line in f 가 낫다.",
        "Handy for small/medium files. For large files prefer for line in f to save memory.",
        "readlines로 만든 리스트와 for+append로 모은 리스트는 결과는 같아도 메모리·유연성이 다르다—수업 비교표 그대로다.",
        "readlines vs for+append: same list shape, different memory and flexibility—as in the lecture table.",
        [
            (
                'f = open("poem.txt", mode="r", encoding="utf-8")\nlines = f.readlines()\nprint(lines)\nf.close()',
                "모든 줄이 리스트로 한 번에 온다.",
                "All lines arrive at once as a list.",
            ),
            (
                'lines = []\nwith open("poem.txt", "r", encoding="utf-8") as f:\n    for line in f:\n        lines.append(line)\n# same list shape; lower peak memory while reading',
                "한 줄씩 append하면 결과 타입은 같고 읽는 중 메모리는 더 적다.",
                "Appending line by line yields the same type with lower peak memory.",
            ),
        ],
    ),
    entry(
        "file-parse",
        "파일 파싱",
        "패턴",
        "pattern",
        "parse split strip int float 텍스트",
        "텍스트 파일의 숫자·날짜·필드는 문자열이므로 필요한 타입으로 바꿔야 한다. 줄을 읽은 뒤 strip·split 등으로 나눈 다음 int/float를 적용하는 과정이 파싱이다.",
        "Numbers and fields in a text file are strings until you convert them. Parsing means strip/split (etc.) then int/float as needed.",
        "line.strip().split(...)",
        "빈 줄·공백·마지막 \\n을 먼저 정리하고 변환한다. 변환 실패는 ValueError—예외 처리와 이어질 수 있다.",
        "Clear blanks and trailing \\n before converting. Failed conversion is ValueError—often paired with exception handling.",
        "read() 한 덩어리와 readlines()/for line 중 무엇을 쓸지는 파일 형식에 맞게 고른다.",
        "Choose read() vs line iteration to match the file layout.",
        [
            (
                'raw = "10 20 30\\n"\nparts = raw.strip().split()\nnums = [int(x) for x in parts]\nprint(nums)\n# [10, 20, 30]',
                "한 줄을 공백으로 나누고 int로 바꾼다. 파일에서 읽은 줄도 같은 순서다.",
                "Split one line on spaces and map int—the same order after reading a file line.",
            ),
            (
                'with open("numbers.txt", "r", encoding="utf-8") as f:\n    vals = [int(line.strip()) for line in f if line.strip()]\nprint(vals)',
                "줄마다 숫자 하나인 파일을 리스트로 모은다. 빈 줄은 건너뛴다.",
                "One number per line into a list; skip blank lines.",
            ),
        ],
    ),
]


def chapter(cid: str, num: str, title_ko: str, title_en: str, lead_ko: str, lead_en: str, articles: list[str]) -> str:
    body = "\n".join(articles)
    return f'''<section class="chapter" id="{cid}" data-exam="final"><header class="chapter-head"><p class="num">{num}</p><div><h2><span class="ko">{title_ko}</span><span class="en">{title_en}</span></h2><p class="lead"><span class="ko">{lead_ko}</span><span class="en">{lead_en}</span></p></div></header>
{body}
</section>

'''


SUM_EXCEPTIONS = '''<article class="entry sum" id="sum-exceptions" data-exam="final" data-keys="try except else finally as err 예외 기말">
<header class="entry-head"><h3><span class="ko">예외 처리 한 줄 (Programming-9 · 기말)</span><span class="en">Exceptions in one line (Programming-9 · final)</span> <span class="exam-tag"><span class="ko">기말</span><span class="en">Final</span></span></h3></header>
<div class="table-wrap"><table class="spec"><thead><tr><th><span class="ko">명령</span><span class="en">Command</span></th><th><span class="ko">형식</span><span class="en">On</span></th><th><span class="ko">한 줄</span><span class="en">In one line</span></th></tr></thead><tbody>
<tr><td><code>예외</code></td><td><span class="ko">개념</span><span class="en">concept</span></td><td><span class="ko">실행 중 비정상. 안 잡으면 traceback 후 종료.</span><span class="en">Abnormal at run time. Uncaught → traceback and exit.</span></td></tr>
<tr><td><code>try / except</code></td><td><span class="ko">문</span><span class="en">statement</span></td><td><span class="ko">위험 구간을 실행하고 맞는 예외만 처리.</span><span class="en">Run a risky block; handle matching exceptions.</span></td></tr>
<tr><td><code>except (A, B)</code></td><td><span class="ko">문</span><span class="en">statement</span></td><td><span class="ko">여러 예외를 튜플로 묶음. 괄호 필수.</span><span class="en">Group exceptions in a tuple; parentheses required.</span></td></tr>
<tr><td><code>except … as</code></td><td><span class="ko">문</span><span class="en">statement</span></td><td><span class="ko">예외 객체를 변수에 담아 메시지 출력.</span><span class="en">Bind the exception object to print its message.</span></td></tr>
<tr><td><code>else / finally</code></td><td><span class="ko">문</span><span class="en">statement</span></td><td><span class="ko">else는 성공만. finally는 항상(정리).</span><span class="en">else on success only; finally always (cleanup).</span></td></tr>
</tbody></table></div>
</article>
'''

SUM_FILES = '''<article class="entry sum" id="sum-files" data-exam="final" data-keys="open read write close with encoding 파일 기말">
<header class="entry-head"><h3><span class="ko">파일 입출력 한 줄 (Programming-10 · 기말)</span><span class="en">Files in one line (Programming-10 · final)</span> <span class="exam-tag"><span class="ko">기말</span><span class="en">Final</span></span></h3></header>
<div class="table-wrap"><table class="spec"><thead><tr><th><span class="ko">명령</span><span class="en">Command</span></th><th><span class="ko">형식</span><span class="en">On</span></th><th><span class="ko">한 줄</span><span class="en">In one line</span></th></tr></thead><tbody>
<tr><td><code>open</code></td><td><span class="ko">function</span><span class="en">function</span></td><td><span class="ko">파일 객체 반환. mode·encoding 지정.</span><span class="en">Returns a file object; set mode and encoding.</span></td></tr>
<tr><td><code>write / read</code></td><td><span class="ko">method</span><span class="en">method</span></td><td><span class="ko">write는 str(텍스트). read는 문자열 덩어리.</span><span class="en">write takes str (text); read returns one string.</span></td></tr>
<tr><td><code>readline / readlines</code></td><td><span class="ko">method</span><span class="en">method</span></td><td><span class="ko">한 줄 / 줄 리스트. \\n 포함 가능.</span><span class="en">One line / list of lines; may keep \\n.</span></td></tr>
<tr><td><code>with open</code></td><td><span class="ko">문</span><span class="en">statement</span></td><td><span class="ko">끝나면 자동 close.</span><span class="en">Auto-closes when the block ends.</span></td></tr>
<tr><td><code>close</code></td><td><span class="ko">method</span><span class="en">method</span></td><td><span class="ko">쓰기 후 필수에 가깝다. 저장·해제.</span><span class="en">Essentially required after writes; saves and releases.</span></td></tr>
</tbody></table></div>
</article>
'''


def main() -> None:
    html = HTML.read_text(encoding="utf-8")

    # remove previous inject if re-run
    html = re.sub(
        r'<section class="chapter" id="exceptions"[^>]*>.*?</section>\s*',
        "",
        html,
        count=1,
        flags=re.S,
    )
    html = re.sub(
        r'<section class="chapter" id="files"[^>]*>.*?</section>\s*',
        "",
        html,
        count=1,
        flags=re.S,
    )
    html = re.sub(
        r'<article class="entry sum" id="sum-exceptions"[^>]*>.*?</article>\s*',
        "",
        html,
        count=1,
        flags=re.S,
    )
    html = re.sub(
        r'<article class="entry sum" id="sum-files"[^>]*>.*?</article>\s*',
        "",
        html,
        count=1,
        flags=re.S,
    )

    ch_ex = chapter(
        "exceptions",
        "17",
        "오류와 예외 처리",
        "Errors and exception handling",
        "Programming-9. 실행 중 예외가 나도 프로그램이 바로 종료되지 않도록 try·except·else·finally로 다룬다. 배경이 어두운 항목이 기말이다.",
        "Programming-9. Use try, except, else, and finally so run-time exceptions do not crash the program. Darker panels are final.",
        EXCEPTIONS,
    )
    ch_files = chapter(
        "files",
        "18",
        "파일 다루기",
        "File handling",
        "Programming-10. 파일을 열고(open) 읽고 쓰며 닫는다. 텍스트·인코딩·with까지 기말 범위다.",
        "Programming-10. Open, read, write, and close files. Text, encoding, and with are in the final range.",
        FILES,
    )

    marker = '<section class="chapter" id="review">'
    if marker not in html:
        raise SystemExit("review chapter not found")
    html = html.replace(marker, ch_ex + ch_files + marker, 1)

    # insert summary tables before sum-more or at end of review catalog
    if 'id="sum-packages"' in html:
        html = html.replace(
            '</article>\n\n<article class="entry sum" id="sum-more"',
            "</article>\n"
            + SUM_EXCEPTIONS
            + SUM_FILES
            + '\n<article class="entry sum" id="sum-more"',
            1,
        )
    else:
        raise SystemExit("sum-packages not found")

    # nav
    html = html.replace(
        '<p class="nav-label final"><span class="ko">기말 · P7–8</span><span class="en">Final · P7–8</span></p>\n'
        '<a class="nav-final" href="#funcs"><span class="idx">15</span><span class="ko">함수</span><span class="en">Functions</span></a>\n'
        '<a class="nav-final" href="#packages"><span class="idx">16</span><span class="ko">모듈·패키지</span><span class="en">Modules · packages</span></a>\n'
        '<p class="nav-label ref"><span class="ko">참고</span><span class="en">Reference</span></p>\n'
        '<a class="nav-ref" href="#review"><span class="idx"><span class="ko">참고</span><span class="en">Ref</span></span><span class="ko">대조 · 정리</span><span class="en">Distinctions · summary</span></a>',
        '<p class="nav-label final"><span class="ko">기말 · P7–10</span><span class="en">Final · P7–10</span></p>\n'
        '<a class="nav-final" href="#funcs"><span class="idx">15</span><span class="ko">함수</span><span class="en">Functions</span></a>\n'
        '<a class="nav-final" href="#packages"><span class="idx">16</span><span class="ko">모듈·패키지</span><span class="en">Modules · packages</span></a>\n'
        '<a class="nav-final" href="#exceptions"><span class="idx">17</span><span class="ko">예외 처리</span><span class="en">Exceptions</span></a>\n'
        '<a class="nav-final" href="#files"><span class="idx">18</span><span class="ko">파일</span><span class="en">Files</span></a>\n'
        '<p class="nav-label ref"><span class="ko">참고</span><span class="en">Reference</span></p>\n'
        '<a class="nav-ref" href="#review"><span class="idx"><span class="ko">참고</span><span class="en">Ref</span></span><span class="ko">대조 · 정리</span><span class="en">Distinctions · summary</span></a>',
    )

    # meta / overview / exam table / catalog / colophon / cache
    reps = [
        (
            "프로그래밍 실습 day 1–4와 Programming-2–8의 Python 문법. 중간 P2–6, 기말 P7 함수·P8 모듈·패키지.",
            "프로그래밍 실습 day 1–4와 Programming-2–10의 Python 문법. 중간 P2–6, 기말 P7–10(함수·모듈·예외·파일).",
        ),
        (
            "실습 day 1–day 4와 수업자료 Programming-2–8의 문법이다.",
            "실습 day 1–day 4와 수업자료 Programming-2–10의 문법이다.",
        ),
        (
            "Syntax from labs day 1–day 4 and lectures Programming-2–8.",
            "Syntax from labs day 1–day 4 and lectures Programming-2–10.",
        ),
        (
            "<td>Programming-7–8 (+ 중간 전제)</td><td><span class=\"ko\">기말 단원 = <strong>P7 함수</strong>(사이트 15)·<strong>P8 모듈·패키지</strong>(사이트 16). <a href=\"#funcs\">함수</a>·<a href=\"#packages\">모듈·패키지</a>로 바로 간다. 어두운 패널이 기말 표시. 막히면 중간 단원으로.</span><span class=\"en\">Final units = <strong>P7 Functions</strong> (site 15) and <strong>P8 Modules·packages</strong> (site 16). Jump via <a href=\"#funcs\">Functions</a> / <a href=\"#packages\">Modules · packages</a>. Darker panels mark final. When stuck, return to midterm chapters.</span></td>",
            "<td>Programming-7–10 (+ 중간 전제)</td><td><span class=\"ko\">기말 = <strong>P7 함수</strong>·<strong>P8 모듈·패키지</strong>·<strong>P9 예외</strong>·<strong>P10 파일</strong> (사이트 15–18). <a href=\"#funcs\">함수</a>·<a href=\"#packages\">모듈</a>·<a href=\"#exceptions\">예외</a>·<a href=\"#files\">파일</a>. 어두운 패널이 기말.</span><span class=\"en\">Final = <strong>P7–10</strong> (site 15–18): <a href=\"#funcs\">Functions</a>, <a href=\"#packages\">Modules</a>, <a href=\"#exceptions\">Exceptions</a>, <a href=\"#files\">Files</a>. Darker panels mark final.</span></td>",
        ),
        (
            '<section class="exam-final"><h3><span class="ko">모듈 · 패키지</span><span class="en">Modules · packages</span></h3><p><a class="exam-final-link" href="#modularize">모듈화</a><a class="exam-final-link" href="#package">패키지</a><a class="exam-final-link" href="#init-py">__init__.py</a><a class="exam-final-link" href="#from-import">from import</a><a class="exam-final-link" href="#import-star">import *</a><a class="exam-final-link" href="#stdlib-pip">표준·외부</a></p></section>\n<section class="exam-ref">',
            '<section class="exam-final"><h3><span class="ko">모듈 · 패키지</span><span class="en">Modules · packages</span></h3><p><a class="exam-final-link" href="#modularize">모듈화</a><a class="exam-final-link" href="#package">패키지</a><a class="exam-final-link" href="#init-py">__init__.py</a><a class="exam-final-link" href="#from-import">from import</a><a class="exam-final-link" href="#import-star">import *</a><a class="exam-final-link" href="#stdlib-pip">표준·외부</a></p></section>\n<section class="exam-final"><h3><span class="ko">예외 · 파일</span><span class="en">Exceptions · files</span></h3><p><a class="exam-final-link" href="#try-except">try/except</a><a class="exam-final-link" href="#try-else-finally">else/finally</a><a class="exam-final-link" href="#open">open</a><a class="exam-final-link" href="#read">read</a><a class="exam-final-link" href="#write">write</a><a class="exam-final-link" href="#with-open">with</a></p></section>\n<section class="exam-ref">',
        ),
        (
            '<a class="exam-final-link" href="#sum-packages"><span class="ko">모듈·패키지 표</span><span class="en">Packages table</span></a></p></section>',
            '<a class="exam-final-link" href="#sum-packages"><span class="ko">모듈·패키지 표</span><span class="en">Packages table</span></a> <a class="exam-final-link" href="#sum-exceptions"><span class="ko">예외 표</span><span class="en">Exceptions table</span></a> <a class="exam-final-link" href="#sum-files"><span class="ko">파일 표</span><span class="en">Files table</span></a></p></section>',
        ),
        (
            "수록 범위는 실습 day 1–day 4와 수업자료 Programming-2–8이다. 중간은 P2–6, 기말은 P7 함수·P8 모듈·패키지(+중간 전제)다.",
            "수록 범위는 실습 day 1–day 4와 수업자료 Programming-2–10이다. 중간은 P2–6, 기말은 P7–10(함수·모듈·예외·파일, +중간 전제)다.",
        ),
        (
            "The scope is labs day 1–day 4 and lectures Programming-2–8. Midterm: P2–6. Final: P7 functions and P8 modules·packages (+ midterm as prerequisite).",
            "The scope is labs day 1–day 4 and lectures Programming-2–10. Midterm: P2–6. Final: P7–10 functions, modules, exceptions, files (+ midterm as prerequisite).",
        ),
        ("css/site.css?v=26", "css/site.css?v=27"),
        ("js/site.js?v=26", "js/site.js?v=27"),
        ("js/walks.js?v=26", "js/walks.js?v=27"),
        ("Python · day 1–4 · P2–8", "Python · day 1–4 · P2–10"),
    ]
    for a, b in reps:
        if a not in html:
            print("WARN missing:", a[:60])
        else:
            html = html.replace(a, b, 1)

    HTML.write_text(html, encoding="utf-8")
    print("updated", HTML)
    print("exceptions entries", len(EXCEPTIONS), "files entries", len(FILES))


if __name__ == "__main__":
    main()
