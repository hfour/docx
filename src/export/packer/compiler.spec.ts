/* tslint:disable:typedef space-before-function-paren */
import * as fs from "fs";

import { Compiler } from "./compiler";
import { File } from "../../file";
import { expect } from "chai";

import * as JSZip from "jszip";

describe("Compiler", () => {
    let compiler: Compiler;
    let file: File;

    beforeEach(() => {
        file = new File();
        compiler = new Compiler(file);
    });

    describe("#compile()", () => {
        it("should pack all the content", async function() {
            this.timeout(99999999);
            const fileName = "build/tests/test.docx";
            await compiler.compile(fs.createWriteStream(fileName));

            const docxFile = fs.readFileSync(fileName);
            const zipFile: JSZip = await JSZip.loadAsync(docxFile);
            const fileNames = Object.keys(zipFile.files).map((f) => zipFile.files[f].name);

            expect(fileNames).is.an.instanceof(Array);
            expect(fileNames).has.length(12);
            expect(fileNames).to.include("word/document.xml");
            expect(fileNames).to.include("word/styles.xml");
            expect(fileNames).to.include("docProps/core.xml");
            expect(fileNames).to.include("docProps/app.xml");
            expect(fileNames).to.include("word/numbering.xml");
            expect(fileNames).to.include("word/header1.xml");
            expect(fileNames).to.include("word/_rels/header1.xml.rels");
            expect(fileNames).to.include("word/footer1.xml");
            expect(fileNames).to.include("word/_rels/footer1.xml.rels");
            expect(fileNames).to.include("word/_rels/document.xml.rels");
            expect(fileNames).to.include("[Content_Types].xml");
            expect(fileNames).to.include("_rels/.rels");
        });

        it("should pack all additional headers and footers", async function() {
            file.createFooter();
            file.createFooter();
            file.createHeader();
            file.createHeader();

            this.timeout(99999999);
            const fileName = "build/tests/test2.docx";
            await compiler.compile(fs.createWriteStream(fileName));

            const docxFile = fs.readFileSync(fileName);
            const zipFile: JSZip = await JSZip.loadAsync(docxFile);
            const fileNames = Object.keys(zipFile.files).map((f) => zipFile.files[f].name);

            expect(fileNames).is.an.instanceof(Array);
            expect(fileNames).has.length(20);

            expect(fileNames).to.include("word/header1.xml");
            expect(fileNames).to.include("word/_rels/header1.xml.rels");
            expect(fileNames).to.include("word/header2.xml");
            expect(fileNames).to.include("word/_rels/header2.xml.rels");
            expect(fileNames).to.include("word/header3.xml");
            expect(fileNames).to.include("word/_rels/header3.xml.rels");
            expect(fileNames).to.include("word/footer1.xml");
            expect(fileNames).to.include("word/_rels/footer1.xml.rels");
            expect(fileNames).to.include("word/footer2.xml");
            expect(fileNames).to.include("word/_rels/footer2.xml.rels");
            expect(fileNames).to.include("word/footer3.xml");
            expect(fileNames).to.include("word/_rels/footer3.xml.rels");
        });
    });
});
