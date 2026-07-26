from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db, Document, Claim
from ocr_engine import ocr_engine
from typing import Optional

router = APIRouter(prefix="/api/ocr", tags=["OCR & Document Processing Engine"])

@router.post("/parse")
async def parse_receipt(
    file_name: Optional[str] = Form("sample_amazon_receipt.png"),
    claim_id: Optional[str] = Form(None),
    expected_amount: Optional[float] = Form(0.0),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    actual_filename = file.filename if file else file_name
    parsed_res = ocr_engine.parse_document(file_name=actual_filename, expected_amount=expected_amount)

    claim_obj = None
    if claim_id:
        claim_obj = db.query(Claim).filter(Claim.claim_id == claim_id).first()

    new_doc = Document(
        doc_id=parsed_res["doc_id"],
        claim_id=claim_obj.id if claim_obj else None,
        file_name=actual_filename,
        doc_type="Receipt",
        file_path=f"/uploads/{actual_filename}",
        parsed_json=parsed_res,
        is_verified=(parsed_res["match_status"] == "MATCHED"),
        ocr_confidence=parsed_res["confidence"]
    )
    db.add(new_doc)
    db.commit()

    return parsed_res
