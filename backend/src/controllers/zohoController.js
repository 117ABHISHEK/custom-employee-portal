const { callZohoApi } = require('../services/zohoService');

// Each of these maps one role's permitted Zoho app to its actual API call.
// Paths shown are illustrative — swap in the exact Zoho endpoints you want to demo.

exports.getPeopleData = async (req, res) => {
  try {
    const data = await callZohoApi(
      '/people/api/forms/P_EmployeeView/records',
      'GET',
      null,
      'people.zoho.in'
    );
    res.json(data);
  } catch (err) {
    res.status(502).json({ message: 'Failed to fetch Zoho People data' });
  }
};

exports.getCrmData = async (req, res) => {
  try {
    const data = await callZohoApi('/crm/v3/Leads?fields=Last_Name,Email,Company,Lead_Status');
    res.json(data);
  } catch (err) {
    res.status(502).json({ message: 'Failed to fetch Zoho CRM data' });
  }
};

exports.getBooksData = async (req, res) => {
  try {
    const data = await callZohoApi(`/books/v3/contacts?organization_id=${process.env.ZOHO_BOOKS_ORG_ID}`);
    res.json(data);
  } catch (err) {
    res.status(502).json({ message: 'Failed to fetch Zoho Books data' });
  }
};

exports.getDeskData = async (req, res) => {
  try {
    const data = await callZohoApi('/desk/api/v1/tickets');
    res.json(data);
  } catch (err) {
    res.status(502).json({ message: 'Failed to fetch Zoho Desk data' });
  }
};