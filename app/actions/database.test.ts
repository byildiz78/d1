import {
  getActiveBranchCount,
  getTotalInspectionCount,
  getCurrentMonthInspectionCount,
  getCurrentWeekInspectionCount,
  getRecentInspections,
  getNotifications,
  getMonthlyInspectionCounts,
  getFormDistribution,
  getInspectionHeader,
  getInspectionDetails,
  getAllInspectionIds,
  getInspectionReport
} from './database';

describe('Database API Tests', () => {
  // Sayım Sorguları Testleri
  describe('Count Queries', () => {
    test('getActiveBranchCount should return active branch count', async () => {
      const result = await getActiveBranchCount();
      expect(result.success).toBe(true);
      expect(typeof result.count).toBe('number');
    });

    test('getTotalInspectionCount should return total inspection count', async () => {
      const result = await getTotalInspectionCount();
      expect(result.success).toBe(true);
      expect(typeof result.count).toBe('number');
    });

    test('getCurrentMonthInspectionCount should return current month inspection count', async () => {
      const result = await getCurrentMonthInspectionCount();
      expect(result.success).toBe(true);
      expect(typeof result.count).toBe('number');
    });

    test('getCurrentWeekInspectionCount should return current week inspection count', async () => {
      const result = await getCurrentWeekInspectionCount();
      expect(result.success).toBe(true);
      expect(typeof result.count).toBe('number');
    });
  });

  // Liste Sorguları Testleri
  describe('List Queries', () => {
    test('getRecentInspections should return recent inspections', async () => {
      const result = await getRecentInspections();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      if (result.data && result.data.length > 0) {
        const inspection = result.data[0];
        expect(inspection).toHaveProperty('No');
        expect(inspection).toHaveProperty('Tarih');
        expect(inspection).toHaveProperty('Şube');
      }
    });

    test('getNotifications should return notifications', async () => {
      const result = await getNotifications();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      if (result.data && result.data.length > 0) {
        const notification = result.data[0];
        expect(notification).toHaveProperty('id');
        expect(notification).toHaveProperty('user');
        expect(notification).toHaveProperty('formName');
      }
    });

    test('getMonthlyInspectionCounts should return monthly inspection counts', async () => {
      const result = await getMonthlyInspectionCounts();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      if (result.data && result.data.length > 0) {
        const monthlyCount = result.data[0];
        expect(monthlyCount).toHaveProperty('Ay');
        expect(monthlyCount).toHaveProperty('DenetimSayisi');
      }
    });

    test('getFormDistribution should return form distribution', async () => {
      const result = await getFormDistribution();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      if (result.data && result.data.length > 0) {
        const formCount = result.data[0];
        expect(formCount).toHaveProperty('form');
        expect(formCount).toHaveProperty('count');
      }
    });
  });

  // Detay Sorguları Testleri
  describe('Detail Queries', () => {
    let testAuditId: number;

    beforeAll(async () => {
      // Get a valid audit ID for testing
      const idsResult = await getAllInspectionIds();
      if (idsResult.success && idsResult.data && idsResult.data.length > 0) {
        testAuditId = idsResult.data[0];
      } else {
        throw new Error('No audit IDs available for testing');
      }
    });

    test('getAllInspectionIds should return inspection IDs', async () => {
      const result = await getAllInspectionIds();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      if (result.data && result.data.length > 0) {
        expect(typeof result.data[0]).toBe('number');
      }
    });

    test('getInspectionHeader should return inspection header', async () => {
      const result = await getInspectionHeader(testAuditId);
      expect(result.success).toBe(true);
      if (result.data) {
        expect(result.data).toHaveProperty('No');
        expect(result.data).toHaveProperty('Tarih');
        expect(result.data).toHaveProperty('Şube');
        expect(result.data).toHaveProperty('Form');
      }
    });

    test('getInspectionDetails should return inspection details', async () => {
      const result = await getInspectionDetails(testAuditId);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      if (result.data && result.data.length > 0) {
        const detail = result.data[0];
        expect(detail).toHaveProperty('Denetim No');
        expect(detail).toHaveProperty('Soru Grubu');
        expect(detail).toHaveProperty('Soru');
      }
    });
  });

  // Raporlama Sorguları Testleri
  describe('Report Queries', () => {
    test('getInspectionReport should return inspection report', async () => {
      const result = await getInspectionReport();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      if (result.data && result.data.length > 0) {
        const report = result.data[0];
        expect(report).toHaveProperty('Şube');
        expect(report).toHaveProperty('Bölge');
        expect(report).toHaveProperty('Denetim Sayısı');
        expect(report).toHaveProperty('Ortalama Puan');
      }
    });
  });
});
