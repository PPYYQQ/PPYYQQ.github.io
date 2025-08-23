import qrcode

# 要转换的网址
url = "https://ppyyqq.github.io/aicc"

# 生成二维码对象
qr = qrcode.QRCode(
    version=1,  # 控制二维码大小，1~40，1是21x21
    box_size=10,  # 每个格子的像素数
    border=4,  # 边框的格子数，默认4
)

qr.add_data(url)
qr.make(fit=True)

# 生成图片
img = qr.make_image(fill_color="black", back_color="white")

# 保存图片
img.save("qrcode.png")

print("二维码已生成并保存为 qrcode.png")