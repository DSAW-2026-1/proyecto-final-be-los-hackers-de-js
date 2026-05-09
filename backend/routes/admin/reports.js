const express = require('express')
const router = express.Router()
const db = require('../../dbManager')

// GET /api/admin/reports?page=X  (paginated list of active reports)
router.get('/', async function (req, res) {
    const pageQuery = Number(req.query.page) || 1
    const page = Math.max(1, Math.floor(pageQuery))
    const limit = 12

    const data = await db.findActiveReports(page - 1, limit)
    if (!data) return res.status(500).json({ error: 'Internal server error' })
    const { result, count } = data
    if (count === 0 || !result || result.length === 0) return res.status(404).json({ error: 'No reports found' })

    const pages = Math.max(1, Math.ceil(count / limit))
    if (page > pages) return res.status(400).json({ error: 'Result page out of range' })

    const resultsObj = {}
    result.forEach((r, idx) => {
        resultsObj[idx] = {
            reportID: r._id,
            reporterID: r.reporterID,
            type: r.type,
            reportedID: r.reportedID,
            category: r.category,
            reportTitle: r.reportTitle,
            reportBody: r.reportBody,
            createdAt: r.createdAt || null
        }
    })

    return res.status(200).json({
        count,
        pages,
        page,
        results: resultsObj
    })
})

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
