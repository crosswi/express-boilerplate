import database from './client.js';

class Repository {
  constructor() {
    this.prisma = database.getClient();
  }

  /**
   * Get model by name
   * @private
   */
  getModel(model) {
    const modelName = model.toLowerCase();
    const prismaModel = this.prisma[modelName];
    
    if (!prismaModel) {
      throw new Error(`Model ${model} not found`);
    }

    return prismaModel;
  }

  /**
   * Create a record
   * @param {string} model - Model name
   * @param {Object} data - Record data
   * @returns {Promise<Object>}
   */
  async create(model, data) {
    const prismaModel = this.getModel(model);
    return prismaModel.create({ data });
  }

  /**
   * Find one record
   * @param {string} model - Model name
   * @param {Object} where - Where conditions
   * @param {Object} options - Query options
   * @returns {Promise<Object>}
   */
  async findOne(model, where, options = {}) {
    const prismaModel = this.getModel(model);
    return prismaModel.findFirst({
      where,
      ...options,
    });
  }

  /**
   * Find unique record
   * @param {string} model - Model name
   * @param {Object} where - Where conditions
   * @param {Object} options - Query options
   * @returns {Promise<Object>}
   */
  async findUnique(model, where, options = {}) {
    const prismaModel = this.getModel(model);
    return prismaModel.findUnique({
      where,
      ...options,
    });
  }

  /**
   * Find many records
   * @param {string} model - Model name
   * @param {Object} where - Where conditions
   * @param {Object} options - Query options
   * @returns {Promise<Array>}
   */
  async findMany(model, where = {}, options = {}) {
    const prismaModel = this.getModel(model);
    return prismaModel.findMany({
      where,
      ...options,
    });
  }

  /**
   * Update one record
   * @param {string} model - Model name
   * @param {Object} where - Where conditions
   * @param {Object} data - Update data
   * @param {Object} options - Query options
   * @returns {Promise<Object>}
   */
  async updateOne(model, where, data, options = {}) {
    const prismaModel = this.getModel(model);
    return prismaModel.update({
      where,
      data,
      ...options,
    });
  }

  /**
   * Update many records
   * @param {string} model - Model name
   * @param {Object} where - Where conditions
   * @param {Object} data - Update data
   * @returns {Promise<Object>}
   */
  async updateMany(model, where, data) {
    const prismaModel = this.getModel(model);
    return prismaModel.updateMany({
      where,
      data,
    });
  }

  /**
   * Delete one record
   * @param {string} model - Model name
   * @param {Object} where - Where conditions
   * @returns {Promise<Object>}
   */
  async deleteOne(model, where) {
    const prismaModel = this.getModel(model);
    return prismaModel.delete({
      where,
    });
  }

  /**
   * Delete many records
   * @param {string} model - Model name
   * @param {Object} where - Where conditions
   * @returns {Promise<Object>}
   */
  async deleteMany(model, where) {
    const prismaModel = this.getModel(model);
    return prismaModel.deleteMany({
      where,
    });
  }

  /**
   * Count records
   * @param {string} model - Model name
   * @param {Object} where - Where conditions
   * @returns {Promise<number>}
   */
  async count(model, where = {}) {
    const prismaModel = this.getModel(model);
    return prismaModel.count({
      where,
    });
  }

  /**
   * Execute operations in a transaction
   * @param {Function} fn - Function to execute in transaction
   * @returns {Promise<any>}
   */
  async transaction(fn) {
    return this.prisma.$transaction(fn);
  }
}

// Export singleton instance
const repository = new Repository();
export default repository;