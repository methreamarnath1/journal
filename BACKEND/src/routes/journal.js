const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth.js");
const journalController = require("../controllers/journal.js");

// Create
router.post("/", auth, journalController.createJournal);

// Read all for logged-in user
router.get("/", auth, journalController.getJournals);

// Read one by ID
router.get("/:id", auth, journalController.getJournalById);

// Update
router.put("/:id", auth, journalController.updateJournal);

// Delete
router.delete("/:id", auth, journalController.deleteJournal);

// Search
router.post("/search", auth, journalController.searchJournals);

module.exports = router;
