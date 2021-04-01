/**
 * @openapi
 * components:
 *   schemas:
 * 
 *     login:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             authToken:
 *               type: string
 *             user:
 *               $ref: '#/components/schemas/user'
 *     user: 
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         username:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         id_role:
 *           type: number
 *         is_active:
 *           type: boolean
 *         is_admin:
 *           type: boolean
 *         is_engineer:
 *           type: boolean
 *         is_technician:
 *           type: boolean
 *         is_operator_calibration:
 *           type: boolean
 *         is_operator_qa:
 *           type: boolean
 *         is_operator_reconditioning:
 *           type: boolean
 *         is_operator_alert_monitor:
 *           type: boolean
 */