window.SITE_CONFIG = {

  /* ===================== 1. Mật khẩu đăng nhập ===================== */
  password: "aiu520",              // 【đổi mật khẩu tại đây】để trống "" = không cần mật khẩu
  passwordHint: "Gợi ý: là cách em gọi anh, cộng thêm cách đọc gần giống của “anh yêu em” bằng tiếng Trung",
  maxAttempts: 1,                  // sau mấy lần sai thì tự động hiện gợi ý (0 = không hiện)

  /* ===================== 2. Thông tin cơ bản ===================== */
  site: {
    title: "Gửi đến em — người đặc biệt nhất",
    openedBy: "Just for you",
    startDate: "2026-09-30",
    birthdayDate: "2008-11-01"
  },

  /* ===================== 3. Hai người (tùy chọn, để tính khoảng cách) ===================== */
  people: {
    me:   { name: "Anh",   city: "China",    lat: 26.6500,  lng: 106.6300 },
    you:  { name: "Em",    city: "Vietnam",  lat: 10.7769,  lng: 106.6950 }
  },

  /* ===================== 4. Video nền / Ảnh nền ===================== */
  background: {
    video:   "assets/video/bg.mp4",
    image:   "assets/images/bg.jpg",
    loginVideo: "",
    overlay: 0.55,
    blur: 0
  },

  /* ===================== 5. Nhạc nền ===================== */
  music: {
    srcs: ["assets/music/bgm1.mp3", "assets/music/bgm2.mp3"],  // phát lần lượt: 1 rồi 2
    title:  "Bài hát của chúng ta",
    volume: 0.45,
    startAt: 0
  },

  /* ===================== 6. Mở đầu (hiệu ứng gõ chữ) ===================== */
  intro: {
    overline: "2026 — ~",
    lines: [
      "Trước khi gặp em,",
      "anh chưa từng nghĩ rằng,",
      "một người cách mình hàng nghìn cây số,",
      "lại trở thành người anh mong gặp nhất mỗi ngày."
    ],
    after: "Từng màn hình tiếp theo, đều là những điều anh muốn nói với em."
  },

  /* ===================== 7. Các chương câu chuyện (thêm bớt tùy ý) ===================== */
  chapters: [
    {
      date: "Ngày 30 tháng 9 năm 2026",
      title: "Lần đầu gặp gỡ",
      text: "Hôm đó chúng ta chỉ nói chuyện phiếm vài câu, chẳng ai nói điều gì đặc biệt.\nNhưng kỳ lạ thay, từ ngày đó, anh bắt đầu mong chờ chiếc điện thoại sáng lên.",
      image: "assets/images/01.jpg",
      caption: "Ảnh chụp cuộc trò chuyện đầu tiên",
      video: "",
      align: "left"
    },
    {
      date: "",
      title: "Bắt đầu trở nên khác biệt",
      text: "Đây là lần đầu tiên chúng ta gọi điện cho nhau, dù chỉ 6 phút,\nnhưng anh vẫn nhớ rõ lắm. Tiếng Anh của em thật sự khiến anh khó hiểu, hahaha 😃😃😃😃",
      image: "assets/images/02.jpg",
      caption: "Ảnh chụp cuộc gọi đầu tiên",
      video: "",
      align: "right"
    },
    {
      date: "",
      title: "Lần đầu nói nhớ qua màn hình",
      text: "Anh đang nhớ em.\nEm có đang nhớ anh không?",
      image: "assets/images/03.jpg",
      caption: "",
      video: "",
      align: "left"
    },
    {
      date: "",
      title: "Em đã trở thành một phần trong cuộc sống của anh",
      text: "Nói thật đi, em có đang chat với quá nhiều người không?\nAnh đã nói tên anh rồi mà em vẫn không nhớ 😡😡",
      image: "assets/images/04.jpg",
      caption: "",
      video: "",
      align: "right"
    },
    {
      date: "",
      title: "Cuộc trò chuyện khiến anh sốc",
      text: "Khi em nói em còn có cả cháu gái và cháu trai, anh sốc đến mức không tin vào tai mình.\nAnh hoàn toàn không ngờ sẽ nghe được điều này, lúc đó chỉ biết gõ “Wth”.",
      image: "assets/images/05.jpg",
      caption: "Ảnh chụp đoạn trò chuyện thú vị này",
      video: "",
      align: "left"
    },
    {
      date: "",
      title: "Câu hỏi khiến anh băn khoăn",
      text: "Em hỏi anh: anh không sợ sẽ thích em sao?\nLúc đó anh cười, nhưng trong lòng thầm nghĩ: em thật sự sẽ thích anh sao?",
      image: "assets/images/06.jpg",
      caption: "Ảnh chụp câu hỏi của em",
      video: "",
      align: "right"
    },
    {
      date: "",
      title: "Lần đầu tiên nghe em gọi anh là bảo bối",
      text: "Em là người đầu tiên gọi anh như vậy, anh sẽ không bao giờ quên.\nĐừng có nói là anh gọi trước đấy nhé!",
      image: "assets/images/07.jpg",
      caption: "Bằng chứng em gọi anh là bảo bối đầu tiên",
      video: "",
      align: "left"
    },
  ],

  story: {
    kicker: "OUR STORY",
    title: "Câu chuyện của chúng ta"
  },

  /* ===================== 8. Album ảnh (không cần thì để mảng rỗng []) ===================== */
  gallery: {
    kicker: "GALLERY",
    title: "Những khoảnh khắc anh muốn giữ lại",
    photos: [
      { src: "assets/images/g1.jpg", caption: "" },
      { src: "assets/images/g2.jpg", caption: "" },
      { src: "assets/images/g3.jpg", caption: "" }
    ]
  },

  /* ===================== 9. Lá thư (để trống "" để tắt) ===================== */
  letter: {
    hello: "Em yêu ：",
    body: [
      "Nhớ lại lúc mới quen nhau, chỉ là những câu chuyện phiếm đơn giản, không ai ngờ sau này lại trở thành đôi bạn thân hợp nhau đến vậy.",
      "Khi đã thân hơn, chúng ta thường trêu chọc nhau, thỉnh thoảng đùa nhau gọi là “bảo bối”, thật thoải mái và tự nhiên, không cần giả vờ làm gì.",
      "Anh biết bên em có rất nhiều bạn bè, khi anh không có ở đó em cũng sẽ chat với người khác. Thành thật mà nói, khi biết điều đó, trong lòng anh cũng thoáng qua một chút cảm xúc nhỏ. Không phải muốn trói buộc em, chỉ vì tình bạn này rất quý giá với anh, anh trân trọng sự ăn ý mà chỉ riêng chúng ta có.",
      "Gặp được một người bạn tri kỷ có thể nói chuyện không ngừng, đùa giỡn bất cứ lúc nào thật sự không dễ. Không cần liên lạc mỗi lúc mỗi nơi, nhưng mỗi lần chat chẳng hề thấy xa cách, có thể vô tư chia sẻ chuyện đời thường, than thở về những điều thú vị — đó chính là người bạn tốt nhất trong lòng anh.",
      "Hôm nay là sinh nhật em, anh muốn nghiêm túc nói với em một lời: chúc mừng sinh nhật. Mong tuổi mới của em thật vô lo vô nghĩ, những điều em mong ước sẽ dần có hồi âm, những nơi em muốn đến đều có cơ hội đặt chân tới, và mỗi ngày đều trọn vẹn, vui vẻ.",
      "Anh rất mong tình bạn quý giá này có thể đi thật lâu dài, đừng dần dần nhạt đi. Mong dù thời gian thế nào đi nữa, chúng ta vẫn có thể như bây giờ, thoải mái trò chuyện và chia sẻ cuộc sống với nhau.",
      "Anh hứa với em, từ nay về sau mỗi năm sinh nhật em, anh đều sẽ nhớ, và sẽ luôn chuẩn bị quà sinh nhật cho em. Không cần phải to tát gì, chỉ mong tình bạn của chúng ta như dòng nước nhỏ chảy dài, bền lâu.",
      "Mong em mãi giữ được ngọn lửa yêu thương, dũng cảm chạy về phía mọi thứ mình thích, và vạn sự như ý."
    ],
    sign: "——Your anh yêu"
  },

  /* ===================== 10. Lời chúc cuối ===================== */
  ending: {
    title: "Chúc Mừng Sinh Nhật",
    text: "Mong tuổi mới của em tràn ngập dịu dàng và may mắn.\nMong em đến được mọi nơi mình muốn đến, và gặp được những người mình muốn gặp.",
    buttonText: "Thổi nến, và ước một điều ước",
    secret: "…Thật ra còn một câu nữa: có em ở đây, thật sự rất tốt.",
    foot: "Từ ngày đầu tiên, đến thật nhiều ngày sau nữa."
  }
};