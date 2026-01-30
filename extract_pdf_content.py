import sys
import importlib.util

def check_install(package):
    if importlib.util.find_spec(package) is None:
        print(f"Package {package} not found.")
        return False
    return True

# check for pypdf or PyPDF2
package_name = 'pypdf'
if not check_install(package_name):
    package_name = 'PyPDF2'
    if not check_install(package_name):
        print("Missing PDF library. Installing pypdf...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
        package_name = 'pypdf'

try:
    if package_name == 'pypdf':
        from pypdf import PdfReader
    else:
        from PyPDF2 import PdfReader

    pdf_path = r"C:\Users\haran\OneDrive\Desktop\labax\public\assets\images\C3449AFB-E1D2-4F55-A4E5-C29852E76103.pdf"
    reader = PdfReader(pdf_path)
    number_of_pages = len(reader.pages)
    print(f"--- Document Content ({number_of_pages} pages) ---")
    for i, page in enumerate(reader.pages):
        print(f"\n--- Page {i+1} ---")
        print(page.extract_text())

except Exception as e:
    print(f"Error reading PDF: {e}")
