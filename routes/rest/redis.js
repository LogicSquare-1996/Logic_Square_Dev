const redis = require('../../lib/redis');

module.exports = {
    /**
     * @api {post} /redis/store Store data in Redis
     * @apiName StoreData
     * @apiGroup Redis
     * @apiVersion 1.0.0
     *
     * @apiParam {String} key Redis key
     * @apiParam {String} value Redis value
     * @apiParam {Number} [ttl] Time to live in seconds (optional)
     *
     * @apiSuccess {Boolean} error false
     * @apiSuccess {String} message Success message
     * @apiSuccess {String} key Stored key
     */
    async storeData(req, res) {
        try {
            const { key, value, ttl } = req.body;
            
            if (!key || !value) {
                return res.status(400).json({ 
                    error: true,
                    reason: 'Key and value are required' 
                });
            }

            const result = await redis.storeData(key, value, ttl);
            return res.json({
                error: false,
                message: 'Data stored successfully',
                key: result.key
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                reason: error.message
            });
        }
    },

    /**
     * @api {get} /redis/get/:key Get data from Redis
     * @apiName GetData
     * @apiGroup Redis
     * @apiVersion 1.0.0
     *
     * @apiParam {String} key Redis key
     *
     * @apiSuccess {Boolean} error false
     * @apiSuccess {String} key Retrieved key
     * @apiSuccess {String} value Retrieved value
     */
    async getData(req, res) {
        try {
            const { key } = req.params;
            const result = await redis.getData(key);
            return res.json({
                error: false,
                key: result.key,
                value: result.value
            });
        } catch (error) {
            if (error.message === 'Key not found') {
                return res.status(404).json({
                    error: true,
                    reason: error.message
                });
            }
            return res.status(500).json({
                error: true,
                reason: error.message
            });
        }
    },

    /**
     * @api {delete} /redis/delete/:key Delete data from Redis
     * @apiName DeleteData
     * @apiGroup Redis
     * @apiVersion 1.0.0
     *
     * @apiParam {String} key Redis key
     *
     * @apiSuccess {Boolean} error false
     * @apiSuccess {String} message Success message
     * @apiSuccess {String} key Deleted key
     */
    async deleteData(req, res) {
        try {
            const { key } = req.params;
            const result = await redis.deleteData(key);
            return res.json({
                error: false,
                message: 'Data deleted successfully',
                key: result.key
            });
        } catch (error) {
            if (error.message === 'Key not found') {
                return res.status(404).json({
                    error: true,
                    reason: error.message
                });
            }
            return res.status(500).json({
                error: true,
                reason: error.message
            });
        }
    },

    /**
     * @api {get} /redis/ttl/:key Get TTL for a key
     * @apiName GetTTL
     * @apiGroup Redis
     * @apiVersion 1.0.0
     *
     * @apiParam {String} key Redis key
     *
     * @apiSuccess {Boolean} error false
     * @apiSuccess {String} key Redis key
     * @apiSuccess {Number} ttl Time to live in seconds
     */
    async getTTL(req, res) {
        try {
            const { key } = req.params;
            const result = await redis.getTTL(key);
            return res.json({
                error: false,
                key: result.key,
                ttl: result.ttl
            });
        } catch (error) {
            if (error.message === 'Key not found') {
                return res.status(404).json({
                    error: true,
                    reason: error.message
                });
            }
            return res.status(500).json({
                error: true,
                reason: error.message
            });
        }
    },

    /**
     * @api {get} /redis/keys List all keys
     * @apiName ListKeys
     * @apiGroup Redis
     * @apiVersion 1.0.0
     *
     * @apiSuccess {Boolean} error false
     * @apiSuccess {Array} keys List of all keys
     */
    async listKeys(req, res) {
        try {
            const result = await redis.listKeys();
            return res.json({
                error: false,
                keys: result.keys
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                reason: error.message
            });
        }
    }
}; 