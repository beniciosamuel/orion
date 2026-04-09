#!/bin/bash

# Server Start Script with Google Cloud Secret Manager Integration
# This script authenticates with Google Cloud, retrieves secrets, and starts the Node.js server

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_error() {
    echo -e "${RED}Error: $1${NC}" >&2
}

print_success() {
    echo -e "${GREEN}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}Warning: $1${NC}"
}

check_gcloud_installed() {
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI is not installed or not in PATH."
        echo "Please install gcloud CLI: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    print_success "gcloud CLI found"
}

check_gcloud_auth() {
    local active_account
    active_account=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | head -n1)
    
    if [ -z "$active_account" ]; then
        print_warning "No active Google Cloud authentication found"
        echo "Starting authentication process..."
        
        if ! gcloud auth login; then
            print_error "Google Cloud authentication failed"
            exit 1
        fi
        print_success "Google Cloud authentication successful"
        return
    fi

    local auth_info
    auth_info=$(gcloud auth describe "$active_account" --format="json" 2>/dev/null)
    
    local is_expired
    local is_valid
    is_expired=$(echo "$auth_info" | jq -r 'if .expired == null then "true" else (.expired | tostring) end')
    is_valid=$(echo "$auth_info" | jq -r 'if .valid == null then "false" else (.valid | tostring) end')
    
    if [ "$is_expired" = "true" ] || [ "$is_valid" = "false" ]; then
        print_warning "Google Cloud authentication has expired or is invalid"
        echo "Starting re-authentication process..."
        
        if ! gcloud auth login; then
            print_error "Google Cloud authentication failed"
            exit 1
        fi
        print_success "Google Cloud re-authentication successful"
    else
        print_success "Google Cloud authentication verified (account: $active_account)"
    fi
}

retrieve_secret() {
    local secret_name="orion_server"
    local secrets_dir=".env"
    local secrets_file="${secrets_dir}/secrets.json"
    
    print_success "Retrieving secret '${secret_name}' from Google Cloud Secret Manager..."
    
    local secret_value
    if ! secret_value=$(gcloud secrets versions access latest --secret="${secret_name}"); then
        print_error "Failed to retrieve secret '${secret_name}'"
        echo "Possible causes:"
        echo "  - Secret '${secret_name}' does not exist"
        echo "  - You don't have permission to access the secret"
        echo "  - Google Cloud project is not set (run: gcloud config set project PROJECT_ID)"
        exit 1
    fi
    
    if [ -z "${secret_value}" ]; then
        print_error "Secret '${secret_name}' is empty"
        exit 1
    fi
    
    if [ ! -d "${secrets_dir}" ]; then
        mkdir -p "${secrets_dir}"
        print_success "Created directory: ${secrets_dir}"
    fi
    
    local temp_file=$(mktemp)
    
    if command -v jq &> /dev/null; then
    
        local jq_error
        if ! jq_error=$(echo "${secret_value}" | jq '.' > "${temp_file}" 2>&1); then
            print_error "Retrieved secret is not valid JSON"
            echo "jq details: ${jq_error}"
            echo "Expected structure example:"
            echo '{"development":{"DB_HOST":"127.0.0.1"},"production":{"DB_HOST":"..."}}'
            echo "Update the '${secret_name}' value in Secret Manager and try again."
            exit 1
        fi
    else
        echo "${secret_value}" > "${temp_file}"
    fi
    
    mv "${temp_file}" "${secrets_file}"
    
    chmod 600 "${secrets_file}"
    
    print_success "Secret saved to ${secrets_file}"
    
    export "ORION_SERVER"="${secret_value}"
    print_success "Secret also exported as ORION_SERVER"
}

resolve_node_env() {
    if [ -n "$1" ]; then
        case "$1" in
            development|production)
                echo "$1"
                ;;
            *)
                print_error "Invalid NODE_ENV: $1 (use 'development' or 'production')"
                exit 1
                ;;
        esac
    elif [ -n "${NODE_ENV}" ]; then
        case "${NODE_ENV}" in
            development|production)
                echo "${NODE_ENV}"
                ;;
            *)
                print_error "Invalid NODE_ENV: ${NODE_ENV} (use 'development' or 'production')"
                exit 1
                ;;
        esac
    else
        echo "development"
    fi
}

main() {
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    SERVER_ROOT="$(dirname "$SCRIPT_DIR")"
    cd "$SERVER_ROOT"

    NODE_ENV_RESOLVED=$(resolve_node_env "$1")
    export NODE_ENV="${NODE_ENV_RESOLVED}"

    echo "=========================================="
    echo "Starting Server with Google Cloud Setup"
    echo "NODE_ENV=${NODE_ENV_RESOLVED}"
    echo "=========================================="
    echo ""
    
    check_gcloud_installed
    
    check_gcloud_auth
    
    retrieve_secret

    echo ""
    echo "=========================================="
    print_success "Google Cloud setup complete"
    echo "=========================================="
    echo ""

    echo "Building server..."
    if ! npm run build; then
        print_error "Build failed"
        exit 1
    fi
    
    echo "Starting server (NODE_ENV=${NODE_ENV_RESOLVED})..."
    echo ""

    if [ "${NODE_ENV_RESOLVED}" = "production" ]; then
        exec node ./dist/index.js
    else
        npx nodemon ./src/index.ts
    fi
}

# Run main function; first argument can be 'development' or 'production'
main "$1"
