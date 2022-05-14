`Voucher` {
    id: string              Mã voucher

    name: string            Tên để quản lý
    content: string         Nội dung để hiển thị bên user

    type: string            Cố định / phần trăm
    value: number           Trị giá <- type
### price: number           Giá mua <= value (chắc vậy) (tỷ lệ?)
                                Giá mua = 0 (chả bt null dc k) (miễn phí)

    quantity: number        Số lượng (0 - vô hạn) (null -> vô hạn?)

    // query
    countUse: number        Đếm số lượng sử dụng (Count(userUse))
    totalUse: number        Tổng trị giá đem lại (Sum(userUse -> value))

    userUse: string[]       Người dùng ([] cho số lượng)
    userOwned: string[]     Người mua (dựa vào số lượng trừ đi)
                            Thắc mắc: liệu mua dc cùng id

    partner: string         Người tạo
    dateCreate: date        Ngày tạo
    dateStart: date         Ngày bắt đầu sử dụng >= dateCreate
    dateEnd: date           Ngày kết thúc sử dụng > dateStart

    service: string         Loại dịch vụ sử dụng
    priceAct: number        Giá áp dụng (chắc thế?)
### placeUse: string[]      Nơi sử dụng (như nhà hàng nào hay địa điểm nào) (mơ hồ)
    typeProd: string        Loại giảm (tất cả hay một vài)
### product: string[]       Các mặt hàng giảm <- typeProd

    status: string          Tình trạng
                                Chưa kích hoạt <- dateStart
###                             Đang kích hoạt <- dateStart - dateEnd (how to bt?)
                                Hết số lượng <- quantity bỏ mặc dateEnd
###                             Hết hạn <- dateEnd bỏ mặc quantity

    article: Article        Định voucher vào bài viết (miễn phí)
}

`Voucher` (
    Tạo voucher
    Tìm id trùng lập            () => list(id)
    Tìm theo dịch vụ            (service) => list
    Tìm theo người dùng         (user) => list(userUse)
    Tìm theo người sở hữu       (user) => list(userOwned)
    Tìm cái k miễn phí          (date, price) => list
    Tìm cái định dùng           (id) => one
    Cập nhật sử dụng            (id, user) => one
)
