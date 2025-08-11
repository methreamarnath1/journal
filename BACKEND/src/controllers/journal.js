const Journal = require("../models/journal");

// Create
exports.createJournal = async (req, res) => {
    try {
        const { title, content, tags, isPublic, summary, image } = req.body;

        const newJournal = new Journal({
            title,
            content,
            tags,
            isPublic,
            summary,
            image,
            createdBy: req.user._id
        });

        await newJournal.save();
        res.status(201).json(newJournal);
    } catch (error) {
        console.error("Error creating journal:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all journals of the logged-in user
exports.getJournals = async (req, res) => {
    try {
        const journals = await Journal.find({ createdBy: req.user._id });
        res.status(200).json(journals);
    } catch (error) {
        console.error("Error fetching journals:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get single journal (must belong to user)
exports.getJournalById = async (req, res) => {
    try {
        const journal = await Journal.findOne({ _id: req.params.id, createdBy: req.user._id });
        if (!journal) {
            return res.status(404).json({ error: "Journal not found" });
        }
        res.status(200).json(journal);
    } catch (error) {
        console.error("Error fetching journal:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update journal (must belong to user)
exports.updateJournal = async (req, res) => {
    try {
        const { title, content, tags, isPublic, summary, image } = req.body;

        const updatedJournal = await Journal.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            { title, content, tags, isPublic, summary, image },
            { new: true }
        );

        if (!updatedJournal) {
            return res.status(404).json({ error: "Journal not found" });
        }

        res.status(200).json(updatedJournal);
    } catch (error) {
        console.error("Error updating journal:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete journal (must belong to user)
exports.deleteJournal = async (req, res) => {
    try {
        const deletedJournal = await Journal.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
        if (!deletedJournal) {
            return res.status(404).json({ error: "Journal not found" });
        }
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting journal:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Search journals (full-text search)
exports.searchJournals = async (req, res) => {
    try {
        const { query } = req.body;
        const journals = await Journal.find({
            $text: { $search: query },
            createdBy: req.user._id
        });

        if (!journals.length) {
            return res.status(404).json({ message: "No journals found" });
        }

        res.status(200).json(journals);
    } catch (error) {
        console.error("Error searching journals:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
