// Thư viện http của node
const http = require("http");
// Khai báo port cho dịch vụ
const port = normalizePort(process.env.PORT || 8080);
// Khai báo thư viện fs  của node xử lý thư mục và tập tin
const fs = require("fs");
// Thư viện mongoDB
const db = require("./mongoDB");

// Tạo dịch vụ:
/*
    request: yêu cầu
    response: hồi đáp
*/
//========================================================================================
const dich_vu = http.createServer((req, res) => {
    let method = req.method;
    let url = req.url;
    // Cấp quyền
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (method == "GET") {
        if (url == "/dsDrink") {
            db.getAll("drink").then(result => {
                let kq = JSON.stringify(result);
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(kq);
            }).catch(err => {
                res.end(JSON.stringify(err));
            })
        } else if (url == "/dsEvent") {
            db.getAll("event").then(result => {
                let kq = JSON.stringify(result);
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(kq);
            }).catch(err => {
                res.end(JSON.stringify(err));
            })
        } else if (url == "/dsFood") {
            db.getAll("food").then(result => {
                let kq = JSON.stringify(result);
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(kq);
            }).catch(err => {
                res.end(JSON.stringify(err));
            })
        } 
        else if (url == "/dsNguoidung") {
            db.getAll("user").then(result => {
                let kq = JSON.stringify(result);
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(kq);
            }).catch(err => {
                res.end(JSON.stringify(err));
            })
        } else if (url == "/Cuahang") {
            db.getOne("store").then(result => {
                let kq = JSON.stringify(result);
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(kq);
            }).catch(err => {
                res.end(JSON.stringify(err));
            })
        } else if (url.match("\.png$")) {
            let imagePath = `./images/${url}`;
            if (!fs.existsSync(imagePath)) {
                imagePath = `./images/noImage.png`;
            }

            let fileStream = fs.createReadStream(imagePath);
            res.writeHead(200, { "Content-Type": "image/png" });
            fileStream.pipe(res);
        } else {
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            let kq = `Bạn sử dụng phương thức GET - ${url} `
            res.end(kq);
        }
    } else if (method == "POST") {
        // Lấy dữ liệu gởi
        let noi_dung_nhan = ``;
        // Nhận thông tin gởi gán vào biến noi_dung_nhan
        req.on("data", (data) => {
            noi_dung_nhan += data;
        })
        //////////////////////////////////////////////////////////////
        if (url == "/ThemNguoidung") {
            req.on("end", () => {
                let kq = {
                    "noi_dung": true
                }

                let user = JSON.parse(noi_dung_nhan);
                db.insertOne("user", user).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(kq));
                }).catch(err => {
                    console.log(err);
                    kq.noi_dung = false;
                    res.end(JSON.stringify(err));
                })

                // Xử lý ghi vào tập tin Nguoi_dung.json
                // let arrNguoidung = JSON.parse(fs.readFileSync("./dulieu/Nguoi_dung.json", "utf8"));
                // let objNguoidung = JSON.parse(noi_dung_nhan);
                // arrNguoidung.push(objNguoidung);
                // fs.writeFileSync("./dulieu/Nguoi_dung.json", JSON.stringify(arrNguoidung));
                // res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                // res.end(JSON.stringify(kq));

            })
        } else if (url == "/SuaNguoidung") {
            req.on("end", () => {
                let kq = {
                    "noi_dung": true
                }
                let objSua = JSON.parse(noi_dung_nhan);
                let filter = {
                    "Ma_so": objSua.Ma_so
                }

                let user = {
                    $set: {
                        "Ten": objSua.Ten,
                        "Ten_Dang_nhap": objSua.Ten_Dang_nhap,
                        "Mat_khau": objSua.Mat_khau
                    }
                }
                db.updateOne("user", filter, user).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(kq));
                }).catch(err => {
                    console.log(err);
                    kq.noi_dung = false;
                    res.end(JSON.stringify(err));
                })


                // let arrNguoidung = JSON.parse(fs.readFileSync("./dulieu/Nguoi_dung.json", "utf8"));
                // let objNguoidung = arrNguoidung.find(x => x.Ma_so == objSua.Ma_so);
                // objNguoidung.Ten = objSua.Ten;
                // objNguoidung.Ten_Dang_nhap = objSua.Ten_Dang_nhap;
                // objNguoidung.Mat_khau = objSua.Mat_khau;
                // fs.writeFileSync("./dulieu/Nguoi_dung.json", JSON.stringify(arrNguoidung));
                // res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                // res.end(JSON.stringify(kq));

            })
        } else if (url == "/XoaNguoidung") {
            req.on("end", () => {
                let kq = {
                    "noi_dung": true
                }
                let objXoa = JSON.parse(noi_dung_nhan);
                let filter = {
                    "Ma_so": objXoa.Ma_so
                }

                db.deleteOne("user", filter).then(result => {
                    console.log(result);
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(kq));
                }).catch(err => {
                    console.log(err);
                    kq.noi_dung = false;
                    res.end(JSON.stringify(err));
                })
                // let arrNguoidung = JSON.parse(fs.readFileSync("./dulieu/Nguoi_dung.json", "utf8"));
                // let vtXoa = arrNguoidung.findIndex(x => x.Ma_so == objXoa.Ma_so)
                // arrNguoidung.splice(vtXoa, 1);
                // fs.writeFileSync("./dulieu/Nguoi_dung.json", JSON.stringify(arrNguoidung));
                // res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                // res.end(JSON.stringify(kq));

            })
        } else {
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            let kq = `Bạn sử dụng phương thức POST - ${url} `
            res.end(kq);
        }
    } else {
        res.end(`Dịch vụ  method:${method} - url:${url} `)
    }
})

// Dịch vụ lắng nghe tại địa chỉ và cổng nào

dich_vu.listen(port, () => {
    console.log(`Dịch vụ thực thi tại địa chỉ http://localhost:${port}`)
})

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
