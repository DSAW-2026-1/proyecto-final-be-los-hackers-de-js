const express = require('express')
const router = express.Router()
const db = require('../../dbManager')

// GET /api/admin/reports/:reportID
router.get('/:reportID', async function (req, res) {
    const { reportID } = req.params
    if (!reportID) return res.status(400).json({ error: 'Report ID required' })

    const report = await db.findReportByID(reportID)
    if (!report) return res.status(404).json({ error: 'Report not found' })

    return res.status(200).json({
        reportID: report._id,
        reporterID: report.reporterID,
        type: report.type,
        reportedID: report.reportedID,
        category: report.category,
        reportTitle: report.reportTitle,
        reportBody: report.reportBody,
        createdAt: report.createdAt || null
    })
})

module.exports = router
