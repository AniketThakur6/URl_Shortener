import urlModel from "../models/url.model.js";
import generateCode from "./../utils/generateCode.utils.js";
import crypto from "crypto";

export const createShortUrlController = async (req, res) => {
  const { url, alias } = req.body;

  let { anonymousUserId } = req.cookies;

  if (!url) {
    return res.status(400).json({
      error: "Please enter a URL",
    });
  }

  if (
    url.startsWith("http://") === false &&
    url.startsWith("https://") === false
  ) {
    return res.status(400).json({
      error: "Please enter a valid URL starting with http:// or https://",
    });
  }

  if (url.length > 2048) {
    return res.status(400).json({ error: "url is too long." });
  }

  if (alias && !/^[a-zA-Z0-9-_]+$/.test(alias)) {
    return res.status(400).json({
      error:
        "Alias may contain only letters, numbers, hyphens, and underscores.",
    });
  }

  // when user is new to our website
  if (!anonymousUserId) {
    anonymousUserId = crypto.randomUUID();
  }

  // const preUrl = await urlModel.findOne({ originalUrl: url });

  const user = await urlModel.findOne({ originalUrl: url, anonymousUserId });

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // days

  // when user exist and give url which already have shortcode both belong to same user
  if (user && !alias) {
    // if url and id belong to same user
    // const isAlreadyhaveGivenUrl = await urlModel.findOne({
    //   anonymousUserId: user?.anonymousUserId,
    //   originalUrl: preUrl?.originalUrl,
    // });

    // console.log('isAlreadyhaveGivenUrl',isAlreadyhaveGivenUrl)

    // if url and id belong to different user so create new document with under exist user and iwth old shortcode
    // if (!isAlreadyhaveGivenUrl) {
    //   const newUser = await urlModel.create({
    //     originalUrl: preUrl.originalUrl,
    //     shortCode: preUrl.shortCode,
    //     anonymousUserId: user.anonymousUserId,
    //     expiresAt,
    //   });
    // }

    res.cookie("anonymousUserId", user.anonymousUserId, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(400).json({
      // message: "URL shortend successfully",
      error: "URL already shorten",
      // data: {
      //   originalUrl: user.originalUrl,
      //   shortCode: user.shortCode,
      // },
    });
  }

  // when user not exist and give url which already have shortcode
  // if (preUrl && !user) {
  //   const newUser = await urlModel.create({
  //     originalUrl: preUrl.originalUrl,
  //     shortCode: preUrl.shortCode,
  //     anonymousUserId,
  //     expiresAt,
  //   });

  //   res.cookie("anonymousUserId", newUser.anonymousUserId, {
  //     httpOnly: true,
  //     sameSite: "lax",
  //   });

  //   return res.status(201).json({
  //     message: "URL shortend successfully",
  //     data: {
  //       originalUrl: preUrl.originalUrl,
  //       shortCode: preUrl.shortCode,
  //     },
  //   });
  // }

  let shortCode = null;

  if (alias) {
    const isAliasExist = await urlModel.findOne({
      shortCode: alias,
    });
    if (isAliasExist) {
      return res.status(401).json({ error: "alias already exist" });
    } else {
      shortCode = alias;
    }
  } else {
    shortCode = generateCode();
    let isShortCodeAlreadyExist = await urlModel.findOne({ shortCode });

    // checking for shortcode already exists
    while (isShortCodeAlreadyExist) {
      shortCode = generateCode();
      isShortCodeAlreadyExist = await urlModel.findOne({ shortCode });
    }
  }
  const newUrl = await urlModel.create({
    originalUrl: url,
    shortCode,
    anonymousUserId,
    expiresAt,
  });

  // when user not exist and give url dont have shortcode
  res.cookie("anonymousUserId", newUrl.anonymousUserId, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(201).json({
    message: "URL shortend successfully",
    data: {
      originalUrl: newUrl.originalUrl,
      shortCode: newUrl.shortCode,
    },
  });
};

export const getAllShortUrl = async (req, res) => {
  const { anonymousUserId } = req.cookies;

  const urls = await urlModel
    .find({ anonymousUserId }, { originalUrl: 1, shortCode: 1, clicks: 1 })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    message: "URLs fetched successfully",
    data: {
      urls,
    },
  });
};

export const urlRedirectController = async (req, res) => {
  const { code } = req.params;

  const url = await urlModel.findOne({ shortCode: code });

  if (!url) {
    return res.status(404).json({
      error: "url not found",
    });
  }

  res.redirect(302, url.originalUrl);

  await urlModel.findByIdAndUpdate(url._id, {
    $inc: { clicks: 1 },
  });
};

export const deleteUrlcontroller = async (req, res) => {
  const { id } = req.params;
  const { anonymousUserId } = req.cookies;

  const url = await urlModel.findOne({ _id: id, anonymousUserId });

  if (!url) {
    return res.status(404).json({ error: "url not found" });
  }

  await urlModel.findByIdAndDelete(url._id);

  return res.status(200).json({
    message: "URL delete successfully",
  });
};
