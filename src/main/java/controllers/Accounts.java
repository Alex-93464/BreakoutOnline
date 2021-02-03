package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.LocalDate;

public class Accounts {
    @GET
    @Path("/account/list")
    public String AccountList() {
        System.out.println("Invoked Accounts.AccountList()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT AccountID, Name FROM Accounts");
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("AccountID", results.getInt(1));
                row.put("Name", results.getString(2));
                response.add(row);
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

    @Path("/account/create")
    public String AccountCreate(@FormDataParam("name") String newName, @FormDataParam("password") String newPassword) {
        System.out.println("Invoked Accounts.AccountList()");
        try {
            int newAccountId=(int) (Math.random()*10000);
            int newSessionToken=(int) (Math.random()*10000);
            Date newDateCreated= Date.valueOf(LocalDate.now());

            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Accounts " +
                    "(AccountID, Name, Password, SessionToken, DateCreated, Admin)" +
                    "VALUES (?,?,?,?,?,false)");
            ps.setInt(1,newAccountId);
            ps.setString(2,newName);
            ps.setString(3,newPassword);
            ps.setInt(4,newSessionToken);
            ps.setDate(5,newDateCreated);
            ps.executeQuery();
            return "{\"Status\": \"OK\"}";

        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }
}
