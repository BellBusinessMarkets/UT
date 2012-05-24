/*!
 * _UT Library - Utilities
 * http://bellbusinessmarkets.github.com/UT
 *
 * @preserve @copyright 2012, Bell Business Markets, http://www.bell.ca/enterprise/EntAbt_BellCie.page
 * @author Daniel Dallala <daniel.dallala@gmail.com> <@ddallala>
 * @contributors 
 *
 * Released under LGPL Version 3 license.
 * http://bellbusinessmarkets.github.com/UT/license.html
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * and the Lesser General Public License along with this program.  
 * If not, see <http://www.gnu.org/licenses/>.
 *
 */
 
_UT.addExtensions({
				  
	/** getQueryParam
     *
     *  @param name    name of parameter to fetch
     * 
     *  @return object
     */  		  
    getQueryParam: function (name) {
        var names_arr = name.split(",");
        if(names_arr.length > 1) {
            for(var i=0; i<names_arr.length;i++){
                if((r = _UT.getQueryParam(names_arr[i])) !== "") return r;
            }
            return "";
        }
        else {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results == null) return "";
            else return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    },
	
	/** To Lower Case
     *
     *  @param object    The object where each value will be lowerCased
     * 
     *  @return object
     */    
     lowerCase: function(obj) {
         _UT.each(obj, function(i,v) {
            if(typeof v == "string") obj[i] = v.toLowerCase();
        });
         return obj;
     },
    


});