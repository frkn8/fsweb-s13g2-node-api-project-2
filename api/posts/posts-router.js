// posts için gerekli routerları buraya yazın

const router = require("express").Router();

const postsModel = require("./posts-model");

// GET isteği ile tüm postları alma

router.get("/", (req, res) => {
  postsModel
    .find()
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      res.status(500).json({ message: "Gönderiler alınamadı" });
    });
});

// GET isteği ile belirli bir postu alma
router.get("/:id", (req, res) => {
  const id = req.params.id;

  postsModel
    .findById(id)
    .then((posts) => {
      if (!posts) {
        return res
          .status(404)
          .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      }
      res.json(posts);
    })
    .catch((error) => {
      res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
    });
});

// POST isteği ile yeni bir gönderi oluşturma
router.post("/", (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    return res
      .status(400)
      .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
  }

  postsModel
    .insert({ title, contents })
    .then((newPost) => {
      postsModel.findById(newPost.id).then((createdPost) => {
        res.status(201).json(createdPost);
      });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    });
});

// PUT isteği ile belirli bir gönderiyi güncelleme
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { title, contents } = req.body;

  if (!title || !contents) {
    return res
      .status(400)
      .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
  }

  postsModel
    .update(id, { title, contents })
    .then(() => {
      postsModel.findById(id).then((updatedPost) => {
        if (!updatedPost) {
          return res
            .status(404)
            .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
        }
        res.json(updatedPost);
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
    });
});

// DELETE isteği ile belirli bir gönderiyi silme
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  postsModel.findById(id).then((post) => {
    if (!post) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }

    postsModel
      .remove(id)
      .then(() => {
        res.json(post);
      })
      .catch((error) => {
        res.status(500).json({ message: "Gönderi silinemedi" });
      });
  });
});

//[GET] /api/posts/:id/comments

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;

  postsModel.findById(id).then((post) => {
    if (!post) {
      return res
        .status(404)
        .json({ message: "Girilen ID'li gönderi bulunamadı." });
    }

    postsModel
      .findPostComments(id)
      .then((comments) => {
        res.json(comments);
      })
      .catch((error) => {
        res.status(500).json({ message: "Yorumlar bilgisi getirilemedi." });
      });
  });
});

module.exports = router;