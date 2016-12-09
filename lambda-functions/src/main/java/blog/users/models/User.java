package blog.users.models;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIgnore;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.amazonaws.services.dynamodbv2.datamodeling.encryption.DoNotTouch;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import blog.configuration.RequestConfiguration;

@DynamoDBTable(tableName = "REPLACED_BY_API")
public class User {

    private String email;
    private String name;
    private String openIdToken;
    private String identityId;
    private String password;
    private byte[] passwordHash;
    private byte[] salt;
    private RequestConfiguration requestConfiguration;

    public User() {
    }

    public User(String email) {
        this.email = email;
    }

    @DynamoDBHashKey(attributeName = "email")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @DynamoDBAttribute
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @DynamoDBAttribute
    @JsonIgnore
    @DoNotTouch
    public byte[] getPasswordHash() {
        return passwordHash;
    }

    @JsonProperty
    public void setPasswordHash(byte[] passwordHash) {
        this.passwordHash = passwordHash;
    }

    @JsonIgnore
    @DynamoDBIgnore
    public String getPassword() {
        return password;
    }

    @JsonProperty
    public void setPassword(String password) {
        this.password = password;
    }

    @DynamoDBAttribute
    @DoNotTouch
    @DynamoDBIgnore
    public String getOpenIdToken() {
        return openIdToken;
    }

    public void setOpenIdToken(String openIdToken) {
        this.openIdToken = openIdToken;
    }

    @DynamoDBAttribute
    @DoNotTouch
    public String getIdentityId() {
        return identityId;
    }

    public void setIdentityId(String identityId) {
        this.identityId = identityId;
    }

    @DynamoDBAttribute
    @DoNotTouch
    public byte[] getSalt() {
        return salt;
    }

    public void setSalt(byte[] salt) {
        this.salt = salt;
    }

    @DynamoDBIgnore
    @JsonIgnore
    public RequestConfiguration getRequestConfiguration() {
        return requestConfiguration;
    }

    @JsonSetter("config")
    public void setRequestConfiguration(RequestConfiguration requestConfiguration) {
        this.requestConfiguration = requestConfiguration;
    }

    @Override
    public String toString() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            return "error";
        }
    }
}