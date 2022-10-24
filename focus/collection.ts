import type {Focus} from './model';
import UserCollection from '../user/collection';
import FocusModel from './model';


/**
 * This files contains a class that has the functionality to explore focus objects
 * stored in MongoDB, including adding and deleting focus objects.
 */
 class FocusCollection {

    /**
     * Create new custom focus setting
     *
     * @param {string} userId - The id of the user making the setting
     * @param {string} settingName - the name of the setting
     * @param {string} settings - the features to include
     * @return {Promise<Focus>} - The new follow information
     */
        static async createSetting(userId: string, settingName: string, settings: string): Promise<Focus> {
        const user = await UserCollection.findOneByUserId(userId);
        const newFocus = new FocusModel({user:user, name: settingName, features: settings});
        await newFocus.save();  // save to DB

        return newFocus;
    }

    /**
     * Get all settings made by the session user
     *
     * @param {string} userId - The id of the user making the setting
     * @return {Promise<Focus[]>} - The new follow information
     */
     static async getSetting(userId: string): Promise<Focus[]> {
        const user = await UserCollection.findOneByUserId(userId);
        const newFocus: Focus[] = await FocusModel.find({user:user});
        return newFocus;
    }

    /**
     * Delete a focus setting
     *
     * @param {string} userId - The id of the user deleting the setting
     * @param {string} settingName - the name of the setting
     * @return {Promise<Boolean>} - true if the setting has been deleted, false otherwise
     */
     static async deleteSetting(userId: string, settingName: string): Promise<boolean> {
        const user = await UserCollection.findOneByUserId(userId);
        const focus = await FocusModel.deleteOne({user:user, name: settingName});
        return focus !== null;
    }

}



export default FocusCollection;