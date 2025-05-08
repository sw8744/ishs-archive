from fastapi import FastAPI, Form, Request, UploadFile, File
from fastapi.responses import FileResponse
import sqlite3
from starlette.middleware.cors import CORSMiddleware
import os

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLite 연결 함수
def getDBConnection():
    conn = sqlite3.connect("archive.db")
    conn.row_factory = sqlite3.Row
    return conn

# DB에서 가져온 데이터를 딕셔너리로 변환하는 함수
def convertToDict(rows):
    return [dict(row) for row in rows]

# 선생님을 리스트로 변환하는 함수
def splitTeacher(teacher):
    if teacher is None:
        return None

    result = teacher.split(",")
    if result == teacher:
        return [teacher]

    return result

# 저장된 시험지 목록을 받아오는 API
@app.get("/api/get")
def get(id: str = None, subject: str = None, year: int = None, grade: int = None, season: int = None, term: int = None,
        teacher: str = None): # 시험지 목록을 불러오는 API
    filter = { # 시험지 검색 필터
        "id": id,
        "subject": subject,
        "year": year,
        "grade": grade,
        "season": season,
        "term": term,
        "teacher": teacher
    }

    filter_f = filter.copy() # None인 필터를 삭제하기 위함

    for key, value in filter.items(): # None인 필터 삭제
        if value is None:
            filter_f.pop(key)

    # DB 연결
    conn = getDBConnection()
    cursor = conn.cursor()
    query = "SELECT * FROM tests"

    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()

    result = convertToDict(rows)
    if filter_f == {}:
        return result
    res = []
    print(filter_f)
    for item in result:
        tf = [False for _ in range(len(filter_f))]
        i = 0
        for key, value in filter_f.items():
            if key == "teacher":
                if filter_f[key] in item[key]:
                    tf[i] = True
            else:
                if item[key] == value:
                    tf[i] = True
            i += 1
        if not False in tf:
            res.append(item)

    print(res)
    return res

# 시험지 PDF 파일을 반환하는 API
@app.get("/api/getpdfview")
def getpdf(id: str):
    pdf_path = f"pdf/{id}.pdf"
    return FileResponse(pdf_path, media_type="application/pdf")

@app.get("/api/getpdf")
def getpdf(id: str):
    pdf_path = f"pdf/{id}.pdf"
    conn = getDBConnection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tests WHERE id = ?", (id,))
    rows = cursor.fetchall()
    if len(rows) == 0:
        return {"status": "not found"}
    result = convertToDict(rows)
    for item in result:
        item["teacher"] = splitTeacher(item["teacher"])
    conn.close()
    filename = f"{result[0]['year']}학년도_{result[0]['grade']}학년_{result[0]['season']}학기_{result[0]['term']}_회고사_{result[0]['subject']}.pdf"
    return FileResponse(pdf_path, media_type="application/pdf", filename=filename)

@app.get("/api/getinfo")
def getinfo():
    # DB 연결
    conn = getDBConnection()
    cursor = conn.cursor()

    # DB에서 시험지 정보 가져오기
    cursor.execute("SELECT * FROM tests")
    rows = cursor.fetchall()
    if len(rows) == 0:
        return {"status": "not found"}
    result = convertToDict(rows)
    for item in result:
        item["teacher"] = splitTeacher(item["teacher"])
    conn.close()

    returnValue = {
        "subject": [],
        "year": [],
        "grade": [],
        "season": [],
        "term": [],
        "teacher": []
    }

    # 각각의 요소별 중복 제거
    for item in result:
        for key, value in item.items():
            if key in returnValue.keys() and value not in returnValue[key]:
                if key == "teacher": # teacher인 경우 리스트이기 때문에 추가 작업 필요
                    for i in value:
                        if i not in returnValue[key]:
                            returnValue[key].append(i)
                else:
                    returnValue[key].append(value)

    return returnValue

@app.post("/api/uploadtests")
async def post(
    id: str = Form(...),
    subject: str = Form(...),
    year: int = Form(...),
    grade: int = Form(...),
    season: int = Form(...),
    term: int = Form(...),
    teacher: str = Form(...),
    file: UploadFile = File(...)
):
    # DB 연결
    conn = getDBConnection()
    cursor = conn.cursor()

    # 이미 있는지 체크
    cursor.execute(
        "SELECT * FROM tests WHERE id = ? AND subject = ? AND year = ? AND grade = ? AND season = ? AND term = ?",
        (id, subject, year, grade, season, term)
    )
    rows = cursor.fetchall()
    if len(rows) > 0:
        return {"status": "already exists"}

    # DB에 저장
    cursor.execute(
        "INSERT INTO tests (id, subject, year, grade, season, term, teacher, answer) VALUES (?, ?, ?, ?, ?, ?, ?, FALSE)",
        (id, subject, year, grade, season, term, teacher)
    )

    conn.commit()
    conn.close()

    pdf_name = f"{id}.pdf"
    pdf_data = await file.read()
    save_path = f"pdf/{pdf_name}"
    os.makedirs("pdf", exist_ok=True)
    with open(save_path, "wb") as f:
        f.write(pdf_data)

    return {"status": "success"}

@app.post("/api/uploadanswers")
async def postanswer(
    id: str = Form(...),
    subject: str = Form(...),
    year: int = Form(...),
    grade: int = Form(...),
    season: int = Form(...),
    term: int = Form(...),
    teacher: str = Form(...),
    file: UploadFile = File(...)
):
    # DB 연결
    conn = getDBConnection()
    cursor = conn.cursor()

    # 이미 있는지 체크
    cursor.execute("SELECT * FROM answers WHERE id = ?", (id, ))
    rows = cursor.fetchall()
    if len(rows) > 0:
        return {"status": "already exists"}

    # 기존 시험지 id 가져오기
    cursor.execute(
        "SELECT * FROM tests WHERE subject = ? AND year = ? AND grade = ? AND season = ? AND term = ? AND teacher = ?",
        (subject, year, grade, season, term, teacher)
    )
    rows = cursor.fetchall()
    if len(rows) == 0:
        return {"status": "not found"}

    testId = rows[0]["id"]

    # DB에 저장
    cursor.execute(
        "INSERT INTO answers (id, test) VALUES (?, ?)",
        (id, testId)
    )

    conn.commit()

    cursor.execute("UPDATE tests SET answer = TRUE WHERE id = ?", (testId, ))

    conn.close()

    pdf_name = f"{testId}_answer.pdf"
    pdf_data = await file.read()
    save_path = f"pdf/{pdf_name}"
    os.makedirs("pdf", exist_ok=True)
    with open(save_path, "wb") as f:
        f.write(pdf_data)

    return {"status": "success"}

@app.get("/api/getanswer")
def getanswer(id: str):
    answer_path = f"./pdf/{id}_answer.pdf"
    if not os.path.exists(answer_path):
        return {"status": "not found"}
    conn = getDBConnection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tests WHERE id = ?", (id,))
    rows = cursor.fetchall()
    if len(rows) == 0:
        return {"status": "not found"}
    result = convertToDict(rows)
    for item in result:
        item["teacher"] = splitTeacher(item["teacher"])
    conn.close()
    filename = f"{result[0]['year']}학년도_{result[0]['grade']}학년_{result[0]['season']}학기_{result[0]['term']}회고사_{result[0]['subject']}_답지.pdf"

    return FileResponse(answer_path, media_type="application/pdf", filename=filename)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)