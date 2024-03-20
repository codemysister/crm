<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceGeneralController;
use App\Http\Controllers\InvoiceGeneralTransactionController;
use App\Http\Controllers\InvoiceSubscriptionController;
use App\Http\Controllers\InvoiceSubscriptionTransactionController;
use App\Http\Controllers\MemoController;
use App\Http\Controllers\MOUController;
use App\Http\Controllers\PartnerAccountSettingController;
use App\Http\Controllers\PartnerBankController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\PartnerPicController;
use App\Http\Controllers\PartnerPriceListController;
use App\Http\Controllers\PartnerSubscriptionController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReferralController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SignatureController;
use App\Http\Controllers\SLAController;
use App\Http\Controllers\SPHController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\STPDController;
use App\Http\Controllers\UserController;
use App\Models\InvoiceSubscriptionTransaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use PhpOffice\PhpWord\Element\Table;
use PhpOffice\PhpWord\SimpleType\TblWidth;
use Spatie\Browsershot\Browsershot;
use Illuminate\Http\Response;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });


Route::get('/browsershot', function () {

    $html = view('pdf.sla')->render();
    $pdf = Browsershot::html($html)
        ->setIncludedPath(config('services.browsershot.included_path'))
        ->showBackground()
        ->save('example.pdf');

    // return new Response($pdf, 200, [
    //     'Content-Type' => 'application/pdf',
    //     'Content-Disposition' => 'attachment; filename="example.pdf"',
    //     'Content-Length' => strlen($pdf)
    // ]);
    // Browsershot::url('https://laravel.com')
    //     ->setIncludedPath(config('services.browsershot.included_path'))
    //     ->save('example.pdf');

});

Route::redirect('/', '/login', 301);

Route::get('/pdf', function () {

    $html = view('pdf.memo')->render();

    $pdf = Browsershot::html($html)
        ->setIncludedPath(config('services.browsershot.included_path'))
        ->showBackground()
        ->showBrowserHeaderAndFooter()
        ->headerHtml('<div></div>')
        ->footerHtml('<div style="text-align: left; font-size: 10px; width:100%; margin-left: 2.5cm; margin-bottom: 1cm;">*) Tarif produk/layanan tidak termasuk biaya admin transaksi <span style="font-style:italic;">user</span> aplikasi <span style="font-style:italic;">mobile</span>.</div>')
        ->save('demo.pdf');


    // Storage::put("public/$path", $pdf);
});

Route::get('/tes', function () {
    $phpWord = new \PhpOffice\PhpWord\TemplateProcessor('assets/template/mou.docx');
    $phpWord->setValues([
        'lembaga' => 'SMKN 1 Purwokerto'
    ]);
    $phpWord->saveAs('sample.docx');
});
// Route::get('/convert', function () {

//     $domPdfPath = base_path('vendor/dompdf/dompdf');

//     \PhpOffice\PhpWord\Settings::setPdfRendererPath($domPdfPath);
//     \PhpOffice\PhpWord\Settings::setPdfRendererName('DomPDF');
//     $Content = \PhpOffice\PhpWord\IOFactory::load(public_path('storage/invoice_langganan/4b883efd-313b-4155-a0ee-338479c81607.docx'));
//     $PDFWriter = \PhpOffice\PhpWord\IOFactory::createWriter($Content, 'PDF');

//     $pdfFileName = time() . '.pdf';
//     $PDFWriter->save(storage_path('app/public/invoice_langganan/' . $pdfFileName));

//     return response()->download(storage_path('app/public/invoice_langganan/' . $pdfFileName));

// });

Route::get('migrate', function () {
    Artisan::call('migrate:fresh --seed --force');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('api/dashboard/{account_manager:id}', [DashboardController::class, 'getPartnerByUser'])->name('getByUser');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Status
    Route::get('/status', [StatusController::class, 'index'])->name('status.index');
    Route::post('/status', [StatusController::class, 'store'])->name('status.store');
    Route::put('/status/{status:uuid}/restore', [StatusController::class, 'restore'])->name('status.restore');
    Route::put('/status/{status:uuid}', [StatusController::class, 'update'])->name('status.update');
    Route::delete('/status/{status:uuid}/force', [StatusController::class, 'destroyForce'])->name('status.destroy.force');
    Route::delete('/status/{status:uuid}', [StatusController::class, 'destroy'])->name('status.destroy');
    Route::get('/api/status', [StatusController::class, 'apiGetStatus'])->name('api.status');
    Route::get('/api/status/arsip', [StatusController::class, 'apiGetStatusArsip'])->name('api.status.arsip');


    // Role
    Route::get('/role-permission', [RoleController::class, 'index'])->name('role-permission.view');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store')->middleware(['can:tambah role']);
    Route::get('/api/roles', [RoleController::class, 'apiGetRole'])->name('api.roles');
    Route::put('/api/roles/{id}', [RoleController::class, 'apiUpdateRole'])->name('api.roles.update')->middleware(['can:edit role']);
    Route::delete('/api/roles/{id}', [RoleController::class, 'apiDeleteRole'])->name('api.roles.delete')->middleware(['can:hapus role']);


    // Perizinan
    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.view')->middleware(['can:lihat permission']);
    Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store')->middleware(['can:tambah permission']);
    Route::get('/api/permissions', [PermissionController::class, 'apiGetPermission'])->name('api.permissions');
    Route::put('/api/permissions/{id}', [PermissionController::class, 'apiUpdatePermission'])->name('api.permissions.update')->middleware(['can:edit permission']);
    Route::delete('/api/permissions/{id}', [PermissionController::class, 'apiDeletePermission'])->name('api.permissions.delete')->middleware(['can:hapus permission']);


    // Role & Perizinan
    Route::put('/role-permission-sync/{id}', [PermissionController::class, 'permissionSync'])->name('permissions.sync')->middleware(['can:setting role permission']);

    // Tanda Tangan
    Route::get('/signatures', [SignatureController::class, 'index'])->name('signatures.view')->middleware(['can:lihat user']);
    Route::post('/signatures', [SignatureController::class, 'store'])->name('signatures.store')->middleware(['can:tambah user']);
    Route::post('/signatures/{signature:uuid}', [SignatureController::class, 'update'])->name('signatures.update')->middleware(['can:edit user']);
    Route::delete('/signatures/{signature:uuid}', [SignatureController::class, 'destroy'])->name('signatures.delete')->middleware(['can:hapus user']);
    Route::get('api/signatures', [SignatureController::class, 'apiGetSignatures'])->name('api.signatures');

    // User
    Route::get('/users', [UserController::class, 'index'])->name('users.view')->middleware(['can:lihat user']);
    Route::get('api/users', [UserController::class, 'apiGetUsers'])->name('api.users');
    Route::post('/users', [UserController::class, 'store'])->name('users.store')->middleware(['can:tambah user']);
    Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update')->middleware(['can:edit user']);
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.delete')->middleware(['can:hapus user']);


    // Produk
    Route::get('/products', [ProductController::class, 'index'])->name('products.view')->middleware(['can:lihat produk']);
    Route::post('/products', [ProductController::class, 'store'])->name('products.store')->middleware(['can:tambah produk']);
    Route::put('/products/{product:uuid}', [ProductController::class, 'update'])->name('products.update')->middleware(['can:edit produk']);
    Route::delete('/products/{product:uuid}', [ProductController::class, 'destroy'])->name('products.destroy')->middleware(['can:hapus produk']);
    Route::get('/api/products', [ProductController::class, 'apiGetProducts'])->name('api.products');

    Route::resource('signature', SignatureController::class);
    Route::get('/api/signature', [SignatureController::class, 'apiGetSignature'])->name('api.signature');



    // Partner
    Route::get('/partners', [PartnerController::class, 'index'])->name('partners.view')->middleware(['can:lihat partner']);
    Route::post('/partners', [PartnerController::class, 'store'])->name('partners.store')->middleware(['can:tambah partner']);
    Route::post('/partners/import', [PartnerController::class, 'import'])->name('partners.import')->middleware(['can:tambah partner']);
    Route::get('/partners/{partner:uuid}', [PartnerController::class, 'show'])->name('partners.show')->middleware(['can:edit partner']);
    Route::post('/partners/{partner}', [PartnerController::class, 'update'])->name('partners.update')->middleware(['can:edit partner']);
    Route::delete('/partners/{partner:uuid}', [PartnerController::class, 'destroy'])->name('partners.destroy')->middleware(['can:hapus partner']);
    Route::get('/api/partner/detail/{partner:uuid}', [PartnerController::class, 'apiGetPartner'])->name('api.partner');
    Route::post('/api/partner/detail/{partner:uuid}', [PartnerController::class, 'updateDetailPartner'])->name('api.update.partner');
    Route::get('/api/partners', [PartnerController::class, 'apiGetPartners'])->name('api.partners');

    // Partner Langganan
    Route::get('/api/subscriptions', [PartnerSubscriptionController::class, 'apiGetSubscription'])->name('api.partners.subscriptions');
    Route::post('/subscriptions', [PartnerSubscriptionController::class, 'store'])->name('partners.subscriptions.store');
    Route::put('/subscriptions/{uuid}', [PartnerSubscriptionController::class, 'update'])->name('partners.subscriptions.update');
    Route::delete('/subscriptions/{uuid}', [PartnerSubscriptionController::class, 'destroy'])->name('partners.subscriptions.destroy');

    // Partner PIC
    Route::post('/pics', [PartnerPicController::class, 'store'])->name('partners.pics.store');
    Route::get('/api/pics', [PartnerPicController::class, 'apiGetPIC'])->name('api.partners.pics');
    Route::put('/pics/{uuid}', [PartnerPicController::class, 'update'])->name('partners.pics.update');
    Route::delete('/pics/{uuid}', [PartnerPicController::class, 'destroy'])->name('partners.pics.destroy');

    // Partner Bank
    Route::post('/banks', [PartnerBankController::class, 'store'])->name('partners.banks.store');
    Route::get('/api/banks', [PartnerBankController::class, 'apiGetPIC'])->name('api.partners.banks');
    Route::put('/banks/{uuid}', [PartnerBankController::class, 'update'])->name('partners.banks.update');
    Route::delete('/banks/{uuid}', [PartnerBankController::class, 'destroy'])->name('partners.banks.destroy');

    // Partner Akun
    Route::post('/accounts', [PartnerAccountSettingController::class, 'store'])->name('partners.accounts.store');
    Route::get('/api/accounts', [PartnerAccountSettingController::class, 'apiGetAccounts'])->name('api.partners.accounts');
    Route::put('/accounts/{uuid}', [PartnerAccountSettingController::class, 'update'])->name('partners.accounts.update');
    Route::delete('/accounts/{uuid}', [PartnerAccountSettingController::class, 'destroy'])->name('partners.accounts.destroy');

    // Partner Tarif
    Route::post('/prices', [PartnerPriceListController::class, 'store'])->name('partners.prices.store');
    Route::get('/api/prices', [PartnerPriceListController::class, 'apiGetPriceLists'])->name('api.partners.prices');
    Route::put('/prices/{uuid}', [PartnerPriceListController::class, 'update'])->name('partners.prices.update');
    Route::delete('/prices/{uuid}', [PartnerPriceListController::class, 'destroy'])->name('partners.prices.destroy');

    // STPD
    Route::get('/stpd', [STPDController::class, 'index'])->name('stpd.view')->middleware(['can:lihat stpd']);
    Route::get('/stpd/create', [STPDController::class, 'create'])->name('stpd.create');
    Route::post('/stpd', [STPDController::class, 'store'])->name('stpd.store')->middleware(['can:tambah stpd']);
    Route::get('/stpd/{stpd:uuid}', [STPDController::class, 'edit'])->name('stpd.edit')->middleware(['can:edit stpd']);
    Route::put('/stpd/{stpd:uuid}', [STPDController::class, 'update'])->name('stpd.update')->middleware(['can:edit stpd']);
    Route::delete('/stpd/{stpd:uuid}', [STPDController::class, 'destroy'])->name('stpd.destroy')->middleware(['can:hapus stpd']);
    Route::get('/api/stpd', [STPDController::class, 'apiGetSTPD'])->name('api.stpd');


    // SPH
    Route::get('/sph', [SPHController::class, 'index'])->name('sph.view')->middleware(['can:lihat sph']);
    Route::get('/sph/create', [SPHController::class, 'create'])->name('sph.create')->middleware(['can:tambah sph']);
    Route::post('/sph', [SPHController::class, 'store'])->name('sph.store')->middleware(['can:tambah sph']);
    Route::get('/sph/{sph:uuid}', [SPHController::class, 'edit'])->name('sph.edit')->middleware(['can:edit sph']);
    Route::put('/sph/{sph:uuid}', [SPHController::class, 'update'])->name('sph.update')->middleware(['can:edit sph']);
    Route::delete('/sph/{sph:uuid}', [SPHController::class, 'destroy'])->name('sph.destroy')->middleware(['can:hapus sph']);
    Route::get('/api/sph', [SPHController::class, 'apiGetSPH'])->name('api.sph');

    // Memo
    Route::get('/memo', [MemoController::class, 'index'])->name('memo.view')->middleware(['can:lihat memo']);
    Route::get('/memo/create', [MemoController::class, 'create'])->name('memo.create')->middleware(['can:tambah memo']);
    Route::post('/memo', [MemoController::class, 'store'])->name('memo.store')->middleware(['can:tambah memo']);
    Route::get('/memo/{memo:uuid}', [MemoController::class, 'edit'])->name('memo.edit')->middleware(['can:edit memo']);
    Route::put('/memo/{memo:uuid}', [MemoController::class, 'update'])->name('memo.update')->middleware(['can:edit memo']);
    Route::delete('/memo/{memo:uuid}', [MemoController::class, 'destroy'])->name('memo.destroy')->middleware(['can:hapus memo']);
    Route::get('/api/memo', [MemoController::class, 'apiGetMemo'])->name('api.memo');

    // MOU
    Route::get('/mou', [MOUController::class, 'index'])->name('mou.view')->middleware(['can:lihat mou']);
    Route::get('/mou/create', [MOUController::class, 'create'])->name('mou.create')->middleware(['can:tambah mou']);
    Route::post('/mou', [MOUController::class, 'store'])->name('mou.store')->middleware(['can:tambah mou']);
    Route::get('/mou/{mou:uuid}', [MOUController::class, 'edit'])->name('mou.edit')->middleware(['can:edit mou']);
    Route::post('/mou/{mou:uuid}', [MOUController::class, 'update'])->name('mou.update')->middleware(['can:edit mou']);
    Route::delete('/mou/{mou:uuid}', [MOUController::class, 'destroy'])->name('mou.destroy')->middleware(['can:hapus mou']);
    Route::get('/api/mou', [MOUController::class, 'apiGetmou'])->name('api.mou');

    // SLA
    Route::get('/sla', [SLAController::class, 'index'])->name('sla.view')->middleware(['can:lihat sla']);
    Route::get('/sla/create', [SLAController::class, 'create'])->name('sla.create')->middleware(['can:tambah sla']);
    Route::post('/sla', [SLAController::class, 'store'])->name('sla.store')->middleware(['can:tambah sla']);
    Route::get('/sla/{sla:uuid}', [SLAController::class, 'edit'])->name('sla.edit')->middleware(['can:edit sla']);
    Route::post('/sla/{sla:uuid}', [SLAController::class, 'update'])->name('sla.update')->middleware(['can:edit sla']);
    Route::delete('/sla/{sla:uuid}', [SLAController::class, 'destroy'])->name('sla.destroy')->middleware(['can:hapus sla']);
    Route::get('/api/sla', [SLAController::class, 'apiGetSla'])->name('api.sla');
    Route::post('/activity/{activity:uuid}', [SLAController::class, 'activityUpdate'])->name('activity.update')->middleware(['can:hapus sla']);
    Route::delete('/activity/{activity:uuid}', [SLAController::class, 'activityDestroy'])->name('activity.destroy')->middleware(['can:hapus sla']);

    // Invoice Umum
    Route::get('/invoice_generals', [InvoiceGeneralController::class, 'index'])->name('invoice_generals.view')->middleware(['can:lihat invoice umum']);
    Route::get('/invoice_generals/create', [InvoiceGeneralController::class, 'create'])->name('invoice_generals.create')->middleware(['can:tambah invoice umum']);
    Route::post('/invoice_generals', [InvoiceGeneralController::class, 'store'])->name('invoice_generals.store')->middleware(['can:tambah invoice umum']);
    Route::get('/invoice_generals/{invoice_generals:uuid}', [InvoiceGeneralController::class, 'edit'])->name('invoice_generals.edit')->middleware(['can:edit invoice umum']);
    Route::put('/invoice_generals/{invoice_generals:uuid}', [InvoiceGeneralController::class, 'update'])->name('invoice_generals.update')->middleware(['can:edit invoice umum']);
    Route::delete('/invoice_generals/{invoice_generals:uuid}', [InvoiceGeneralController::class, 'destroy'])->name('invoice_generals.destroy')->middleware(['can:hapus invoice umum']);
    Route::get('/api/invoice_generals', [InvoiceGeneralController::class, 'apiGetInvoiceGenerals'])->name('api.invoice_generals');

    // Invoice Umum Transaksi
    Route::get('/invoice_generals/transaction', [InvoiceGeneralTransactionController::class, 'index'])->name('invoice_generals.transaction.view')->middleware(['can:lihat transaksi']);
    Route::post('/invoice_generals/transaction', [InvoiceGeneralTransactionController::class, 'store'])->name('invoice_generals.transaction.store')->middleware(['can:tambah transaksi']);
    Route::put('/invoice_generals/transaction/{transaction:uuid}', [InvoiceGeneralTransactionController::class, 'update'])->name('invoice_generals.transaction.update')->middleware(['can:edit transaksi']);
    Route::delete('/invoice_generals/transaction/{transaction:uuid}', [InvoiceGeneralTransactionController::class, 'destroy'])->name('invoice_generals.transaction.destroy')->middleware(['can:edit transaksi']);

    // Invoice Langganan
    Route::get('/invoice_subscriptions', [InvoiceSubscriptionController::class, 'index'])->name('invoice_subscriptions.view')->middleware(['can:lihat invoice langganan']);
    Route::get('/invoice_subscriptions/create', [InvoiceSubscriptionController::class, 'create'])->name('invoice_subscriptions.create');
    Route::post('/invoice_subscriptions', [InvoiceSubscriptionController::class, 'store'])->name('invoice_subscriptions.store')->middleware(['can:tambah invoice langganan']);
    Route::post('/invoice_subscriptions/batch', [InvoiceSubscriptionController::class, 'storeBatch'])->name('invoice_subscriptions.store.batch')->middleware(['can:tambah invoice langganan']);
    Route::post('/invoice_subscriptions/zip', [InvoiceSubscriptionController::class, 'zipAll'])->name('invoice_subscriptions.zip')->middleware(['can:lihat invoice langganan']);
    Route::put('/invoice_subscriptions/{invoice_subscriptions:uuid}', [InvoiceSubscriptionController::class, 'update'])->name('invoice_subscriptions.update')->middleware(['can:hapus invoice langganan']);
    Route::delete('/invoice_subscriptions/{invoice_subscriptions:uuid}', [InvoiceSubscriptionController::class, 'destroy'])->name('invoice_subscriptions.destroy')->middleware(['can:hapus invoice langganan']);
    Route::get('/api/invoice_subscriptions/bundle', [InvoiceSubscriptionController::class, 'apiGetInvoiceSubscriptionsWithBundle'])->name('api.invoice_subscriptions.bundle');
    Route::get('/api/invoice_subscriptions', [InvoiceSubscriptionController::class, 'apiGetInvoiceSubscriptions'])->name('api.invoice_subscriptions');
    Route::get('/invoice_langganan/{uuid}', [InvoiceSubscriptionController::class, 'editInvoice']);

    // Invoice Langganan Transaksi
    Route::get('/invoice_subscriptions/transaction', [InvoiceSubscriptionTransactionController::class, 'index'])->name('invoice_subscriptions.transaction.view')->middleware(['can:lihat transaksi']);
    Route::post('/invoice_subscriptions/transaction', [InvoiceSubscriptionTransactionController::class, 'store'])->name('invoice_subscriptions.transaction.store')->middleware(['can:tambah transaksi']);
    Route::put('/invoice_subscriptions/transaction/{transaction:uuid}', [InvoiceSubscriptionTransactionController::class, 'update'])->name('invoice_subscriptions.transaction.update')->middleware(['can:edit transaksi']);
    Route::delete('/invoice_subscriptions/transaction/{transaction:uuid}', [InvoiceSubscriptionTransactionController::class, 'destroy'])->name('invoice_subscriptions.transaction.destroy')->middleware(['can:edit transaksi']);

    // Referral
    Route::get('/referral', [ReferralController::class, 'index'])->name('referral.view')->middleware(['can:lihat invoice umum']);
    Route::post('/referral', [ReferralController::class, 'store'])->name('referral.store')->middleware(['can:tambah invoice umum']);
    Route::post('/referral/{referral:uuid}', [ReferralController::class, 'update'])->name('referral.update')->middleware(['can:edit invoice umum']);
    Route::delete('/referral/{referral:uuid}', [ReferralController::class, 'destroy'])->name('referral.destroy')->middleware(['can:hapus invoice umum']);
    Route::get('/api/referral', [ReferralController::class, 'apiGetReferral'])->name('api.referral');
});


require __DIR__ . '/auth.php';
