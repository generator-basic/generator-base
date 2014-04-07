/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package <%= groupArtifactName %>.<%=packageAppName%>.domain;

import java.io.Serializable;

/**
 *
 * @author benjamin
 */
public class UserBean implements Serializable {
      
    private String login;
    
    private String firstName;
    
    private String lastName;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    
}
